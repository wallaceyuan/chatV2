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

exports.userViolatorRedis = function(data,callback){
    var client = data.client;
    client.hgetall('kkUserBlack'+data.code, function (err, obj) {
        if(obj){
            console.log('getViolator-you');
            callback({code:110,msg:'被禁言用户'},null);
        }else {
            console.log('getViolator-wu');
            callback(null,0);
        }
    });
}

exports.userAllowedRedis = function(data,callback){
    var client = data.client;
    client.hgetall(data.code, function (err, obj) {
        if(obj){
            console.log('getAllowed-you');
            callback(null,obj);
        }else {
            console.log('getAllowed-wu');
            var codeOpt = {
                uri: 'http://ums.kankanews.com/t/tokenValidate.do',
                method: 'POST',
                body : data.code,
                headers: {'Content-Type': 'text/xml'}
            };
            request(codeOpt,function(err,res,body){
                var body = JSON.parse(body);
                if(parseInt(body.code) == 0){
                    client.multi().HMSET(data.code, body).expire(data.code,3600).exec(function (err, replies) {
                        console.log("MULTI got " + replies.length + " replies");
                    });
                    callback(null,body);
                }else{
                    callback({code:body.code,msg:body.msg},null);
                }
            });
        }
    });
}

exports.roomValidateSql = function(nsp,infoid,callback){
    var sid  = 'infoid';
    if(nsp == 'wechat')
        sid = 'id';

    pool.query('select t1.id from kk_danmaku_chatrooms as t1,kk_danmaku_namespace as t2 where t2.id = t1.type and namespace = ? and '+sid+' = ? and open = ? ',[nsp,infoid,1],function(err,rows){
        if(err){
            console.log(err);
        }else{
            if(rows.length>0){
                callback(null,rows[0]);
            }else{
                callback({code:400,msg:'没有对应开放的房间'},null);
            }
        }
    });
}

exports.userValidateSql = function(data,callback){
    var client = data.client;
    client.hgetall('kkUserBlack'+data.code, function (err, obj) {
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
                        client.multi().HMSET('kkUserBlack'+data.code, '1').expire('kkUserBlack'+data.code,3600).exec(function (err, replies) {
                            console.log("MULTI got " + replies.length + " replies");
                        });
                        callback({code:110,msg:'黑名单用户'},null);
                    }else{
                        callback(null,{msg:'OK'});
                    }
                }
            });
        }
    });
}

exports.messageValidate = function(data,callback){

    var client = data.client,res = data.result,code = res.code;

    var codeOpt = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://kankanews.cn-north-1.eb.amazonaws.com.cn/KKShielder',
        method: 'POST',
        body:"words="+res.message
    };
    request(codeOpt,function(err,result,body){
        var body = JSON.parse(body);
        //console.log(body.size);
        if(parseInt(body.size) > 0){
            client.multi().HMSET('kkUserBlack'+code, {free:1}).expire('kkUserBlack'+code,3600).exec(function (err, replies) {
                console.log("kkUserBlack set");
            });
            pool.query('replace into kk_danmaku_violators(uid,openid,tel,nickName,posterURL,createTime,free) values(?,?,?,?,?,?,?)',[res.uid,'',res.tel,res.nickName,res.posterURL,res.createTime,1],function(err,result){
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                }
            });
            callback({code:444,msg:'存在敏感词'},null);
        }else{
            callback(null,0);
        }
    });
}

//把分类列表存入数据库
exports.category = function(list,callback){
    async.forEach(list,function(item,cb){
        debug('保存分类',JSON.stringify(item));
        pool.query('replace into category(id,name,url) values(?,?,?)',[item.id,item.name,item.url],function(err,result){
            cb();
        });
    },callback);
}