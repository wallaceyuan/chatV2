
var user = require('./user');
exports.task = function(data){
    function(done){//用code查询是否被禁言(redis)
        console.log('-------------svolidate-------------');
        user.userViolatorRedis({token:data.token},function(err,res){
            console.log('evolidate');
            done(err,res);
        });
    },
    function(arg,done){//用code检测时候是allow用户（redis/sso）
        console.log('sallow');
        user.userAllowedRedis({token:data.token},function(err,res){
            console.log('eallow');
            done(err,res);
        });
    },
}
