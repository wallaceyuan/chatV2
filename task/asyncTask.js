var config = require('./config');
var user = require('./user');
var iconv = require('iconv-lite');
var async = require('async');
var moment = require('moment');
var redis = require('redis');
var _ = require('lodash')

var user = require('./user');
var service = require('./service');
var client  = config.client;

exports.Violator = function(done,data){
	if(data.token){
		user.userViolatorRedis({token:data.token},function(err,res){
			console.log('evolidate');
			done(err,res);
		});
	}
	if(data.openid){
		user.userViolatorWechatRedis({openid:data.openid},function(err,res){
			console.log('evolidate');
			done(err,res);
		});
	}
}

exports.timeCheck = function (done) {
	console.log(arguments)
	done(null,1);
}

exports.Allowed = function(arg,done,data){
	if(data.openid){
		var data = {
			"uid":1,
			"tel":1,
			"openid":data.openid,
			"posterURL":data.posterURL,
			"nickName":data.nickName
		};
		var res = {
			"data":JSON.stringify(data)
		};
		done(null,res);
	}
	if(data.token){
		user.userAllowedRedis({token:data.token},function(err,res){
			console.log('eallow');
			done(err,res);
		});
	}
}

exports.historyData = function(room,socket){
	client.LRANGE('messageKKDM'+room,0,10,function(err, objs){
		if(err){
			console.log(err);
		}else{
			objs = objs.map(function(obj){
				try{
					var rObj = JSON.parse(obj);
					return rObj;
				}catch(e){
					console.log(e);
				}
			});
			socket.emit('historyData',{history:objs.reverse()});
		}
	});
}

exports.selogic = function (result,namBox) {
	var time = moment().unix();
	try{
		var place = result.place.split(':');
	}catch(e){
		console.log('empty data',result);
		return;
	}
	var nsp = place[0],room = place[1];
	var middle = JSON.stringify(result)

	result.room = room;
	console.log('selogic start '+' nsp: '+nsp +" room "+room + ' time: '+time);
	async.waterfall([
		function(done){
			service.roomValidateSql(nsp,room,function(err,res){
				done(err,res);
			});
		},
		function(arg,done){
			service.messageValidate({result:result},function(err,res){
				var res = _.assignIn(res,arg);
				done(err,res);
			});
		},
		function (arg,done) {
			var delBox = ['socketid','cid','place','room']
			delBox.map((item)=>{
				delete result[item]
			})
            var data = _.assignIn({},result,arg);
            //console.log('postServer',data)
            service.postServer(data,function (err,res) {
				done(err,arg);
			})
		}
	],function(err,res){
		var result = JSON.parse(middle)
		console.log('-------------result.message:'+result.message+'-------------');
		console.log('result.socketid:',result.socketid);
		if(err){
			console.log('err!!!!',err);
			err.room = room;
			err.socketid = result.socketid;
            if(namBox[nsp]){
                namBox[nsp].emit('messageError',err);
                console.log('-------------messageError, nexttick-------------');
            }else{
                console.log('-------------error namespace-------------');
            }
		}else{
			if(namBox[nsp]){
				namBox[nsp].emit('seRedisCome',result);
				console.log('-------------redisEmit all done-------------');
			}else{
				console.log('error namespace');
			}
		}
	});
}

exports.kklogic = function (result,namBox) {
	var time = moment().unix();
	try{
		var place = result.place.split(':');
		//console.log('place',result.place);
	}catch(e){
		console.log('empty data',result);
		return;
	}
	var nsp = place[0],room = place[1];
	result.room = room;
	console.log('start '+' nsp: '+nsp +" room "+room + ' time: '+time);

	async.waterfall([
		function(done){
			//console.log('sroom');
			user.roomValidateSql(nsp,room,function(err,res){
				//console.log('room done');
				done(err,res);
			});
		},
		function(res,done){
			//console.log('suser');
			user.userValidateSql({token:result.token,uid:result.uid,openid:result.openid},function(err,res){
				//console.log('user done'/*,res*/);
				done(err,res);
			});
		},
		function(res,done){
			//console.log('ssql');
			user.messageDirty({msg:result.message},function(err,res){
				//console.log('sql done'/*,res*/);
				done(err,res);
			});
		},
		function(arg,done){
			//console.log(arg,'skey');
			user.messageValidate({result:result},function(err,res){
				//console.log('key done'/*,res*/);
				done(err,res);
			});
		},
	],function(err,res){
		console.log('-------------result.message:'+result.message+'-------------');
		console.log('result.socketid:',result.socketid);
		if(err){
			console.log('err!!!!',err);
			err.room = room;
			err.socketid = result.socketid;
			if(parseInt(err.status) == 702){//存在敏感词
				result.violate = 1;
				user.messageToKu(result,function(error,data){
					if(error){
						error.room = room;
						error.socketid = result.socketid;
						namBox[nsp].emit('messageError',error);
						return
					}
					if(namBox[nsp]){
						namBox[nsp].emit('messageError',err);
						console.log('-------------messageError, nexttick-------------');
					}else{
						console.log('-------------error namespace-------------');
					}
				});
			}else{
				if(namBox[nsp]){
					namBox[nsp].emit('messageError',err);
					console.log('-------------messageError, nexttick-------------');
				}else{
					console.log('-------------error namespace-------------');
				}
			}
		}else{
			if(namBox[nsp]){
				/*历史数据功能*/
				client.multi().lpush('messageKKDM'+nsp+room,JSON.stringify(result),redis.print).expire('messageKKDM'+nsp+room,600).exec(function (err, replies) {
					if(err){
						callback({"status":706,"msg":'sclient 154 ��ѯ����'},null);
						console.log(8,err);
					}else{
						//console.log("kkUserBlack set");
					}
				});
				/*历史数据功能*/
				client.llen('messageKKDM'+nsp+room, function(error, count){
					if(error){
						console.log(error);
					}else{
						if(count >5){
							client.rpop('messageKKDM'+nsp+room,function(err,result){
								if(err){
									console.log(err);
								}
							});
						}
					}
				});
				var messageSave = result.message;
				user.messageToKu(result, function (error,data) {
					if(error){
						error.room = room;
						error.socketid = result.socketid;
						namBox[nsp].emit('messageError',error);
						return
					}
					if(err){
						console.log(err);
					}else{
						result.message = messageSave;
						namBox[nsp].emit('redisCome',result);
						console.log('-------------redisEmit all done-------------',data);
					}
				});
			}else{
				console.log('error namespace');
			}
		}
	});
}


