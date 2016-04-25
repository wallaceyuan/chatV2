/**
 * Created by Yuan on 2016/4/24.
 */
var request = require('request');
var async = require('async');
var debug = require('debug')('mysql:save');
var mysql = require('mysql');
var pool = mysql.createPool({
    host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
    user:'kankanewsapi',
    password:'kankanewsaws2016',
    database:'kk_danmaku'
});

//把分类列表存入数据库
exports.category = function(list,callback){
    async.forEach(list,function(item,cb){
        debug('保存分类',JSON.stringify(item));
        pool.query('replace into category(id,name,url) values(?,?,?)',[item.id,item.name,item.url],function(err,result){
            cb();
        });
    },callback);
}

exports.getCode = function(data,callback){
    var client = data.client;
    client.hgetall(data.code, function (err, obj) {
        if(obj){
            console.log('getCode-you');
            callback(null,obj);
        }else {
            console.log('getCode-wu');
            var codeOpt = {
                uri: 'http://ums.kankanews.com/t/tokenValidate.do',
                method: 'POST',
                body : data.code,
                headers: {'Content-Type': 'text/xml'}
            };
            request(codeOpt,function(err,res,body){
                var body = JSON.parse(body);
                if(parseInt(body.code) == 0){
                    client.HMSET(data.code, body);
                    client.expire(data.code,3600);
                    callback(null,body);
                }else{
                    callback({code:body.code,msg:body.msg},null);
                }
            });
        }
    });
}

exports.userValidate = function(data,callback){
    var client = data.client;
    client.hgetall('kkUserBlack'+data.uid, function (err, obj) {
        if(obj){
            console.log('kkUserBlack-you');
            callback({code:110,msg:'黑名单用户'},null);
        }else {
            console.log('kkUserBlack-wu');
            pool.query('select * from kk_danmaku_violators where uid = ?',[data.uid],function(err,rows){
                if(err){
                    console.log(err);
                }else{
                    if(rows.length>0){
                        rows[0].openid = 111;
                        client.HMSET('kkUserBlack'+data.uid, '1');
                        client.expire(data.code,3600);
                        callback({code:110,msg:'黑名单用户'},null);
                    }else{
                        callback(null,'0');
                        /*                        var uid ='68',tel ='18521355675',nickName ='ss',posterURL ='http://q.qlogo.cn/qqapp/1103880827/A0C6E87820CBA8AFC1ECF3308337E0D0/100',createTime = new Date(),free = 1;
                         console.log('无此人',new Date());
                         pool.query('replace into kk_danmaku_violators(uid,tel,nickName,posterURL,createTime,free) values(?,?,?,?,?,?)',[uid,tel,nickName,posterURL,createTime,free],function(err,result){
                         if(err){
                         console.log(err);
                         }else{
                         console.log(result);
                         }
                         });*/
                    }
                }
            });
        }
    });
}