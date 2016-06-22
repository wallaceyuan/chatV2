var config = require('./config');
var client  = config.client;
var user = require('./user');
var iconv = require('iconv-lite');



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


