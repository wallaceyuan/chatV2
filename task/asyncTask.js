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


