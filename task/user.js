/**
 * Created by Yuan on 2016/4/24.
 */
var request = require('request');
var async = require('async');
var debug = require('debug')('mysql:save');


var config = require('../task/config');
var client  = config.client;
var pool  = config.pool;

exports.userViolatorRedis = function(data,callback){
    client.hgetall('kkUserBlack'+data.token, function (err, obj) {
        if(err){
            console.log(err);
        }else{
            if(obj){
                console.log('getViolator-you');
                callback({code:700,msg:'被禁言用户'},null);
            }else {
                console.log('getViolator-wu');
                callback(null,0);
            }
        }
    });
}

exports.userAllowedRedis  = function(data,callback){
    client.hgetall(data.token, function (err, obj) {
        if(obj){
            console.log('getAllowed-you');
            callback(null,obj);
        }else {
            console.log('getAllowed-wu');
            var codeOpt = {
                uri: 'http://ums.kankanews.com/t/tokenValidate.do',
                method: 'POST',
                body : data.token,
                headers: {'Content-Type': 'text/xml'}
            };
            request(codeOpt,function(err,res,body){
                var body = JSON.parse(body);
                if(parseInt(body.code) == 0){
                    client.multi().HMSET(data.token, body).expire(data.token,3600).exec(function (err, replies) {
                        if(err){
                            console.log(err);
                        }else{
                            console.log("MULTI got " + replies.length + " replies");
                        }
                    });
                    callback(null,body);
                }else{
                    callback({code:body.code,msg:body.msg},null);
                }
            });
        }
    });
}

exports.userRoomIn = function(data,callback){
    var uid = data.uid;
    var users = data.users;
    var room = data.room;
    if(users.length == 0){
        callback(null,0);
    }else{
        var judge = users.filter(function(user){
            if(user)
                return room == user.room && uid == user.uid;
        });
        if(judge.length > 0){
            callback({code:704,msg:'用户在同一个命名空间下的房间内重复登录'},null);
        }else{
            callback(null,0);
        }
    }
}

exports.roomValidateSql   = function(nsp,infoid,callback){
    var sid  = 'infoid';
    if(nsp == 'wechat')
        sid = 't1.id';

    pool.query('select t1.id from kk_danmaku_chatrooms as t1,kk_danmaku_namespace as t2 where t2.id = t1.type and namespace = ? and '+sid+' = ? and open = ? ',[nsp,infoid,1],function(err,rows){
        if(err){
            console.log(err);
        }else{
            if(rows.length>0){
                callback(null,rows[0]);
            }else{
                callback({status:701,msg:'没有对应开放的聊天室'},null);
            }
        }
    });
}

exports.userValidateSql   = function(data,callback){
    client.hgetall('kkUserBlack'+data.token, function (err, obj) {
        if(obj){
            console.log('kkUserBlack-you');
            callback({status:700,msg:'被禁言用户'},null);
        }else {
            console.log('kkUserBlack-wu');
            pool.query('select id from kk_danmaku_violators where uid = ? and free = 0',[data.uid],function(err,rows){
                if(err){
                    console.log(err);
                }else{
                    if(rows.length>0){
                        client.multi().HMSET('kkUserBlack'+data.token, {free:0}).expire('kkUserBlack'+data.token,3600).exec(function (err, replies) {
                            console.log("MULTI got " + replies.length + " replies");
                        });
                        callback({status:700,msg:'被禁言用户'},null);
                    }else{
                        callback(null,{msg:'OK'});
                    }
                }
            });
        }
    });
}

exports.messageValidate   = function(data,callback){

    var res = data.result,token = res.token;

    var codeOpt = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://kankanews.cn-north-1.eb.amazonaws.com.cn/KKShielder',
        method: 'POST',
        body:"words="+res.message
/*
        body:"words="+res.message+res.nickName
*/
    };
    request(codeOpt,function(err,result,body){
        var body = JSON.parse(body);
        //console.log('codeOpt',body,res.message+res.nickName,body.size,parseInt(body.size));
        if(parseInt(body.size) > 0){
            client.multi().HMSET('kkUserBlack'+token, {free:0}).expire('kkUserBlack'+token,3600).exec(function (err, replies) {
                if(err){
                    console.log(err);
                }else{
                    console.log("kkUserBlack set");
                }
            });
            pool.query('replace into kk_danmaku_violators(uid,openid,tel,nickName,posterURL,createTime,free) values(?,?,?,?,?,?,?)',[res.uid,'',res.tel,res.nickName,res.posterURL,res.createTime,0],function(err,result){
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                }
            });
            callback({status:702,msg:'存在敏感词'},null);
        }else{
            callback(null,0);
        }
    });
}

exports.messageDirty      = function(message,callback){
    console.log(message.msg);
    var re = /select|update|delete|exec|count|=|;|>|<|%/i;
    if (re.test(message.msg)) {//特殊字符和SQL关键字
        console.log('存在特殊字符');
        callback({status:703,msg:'存在特殊字符'},null);
    }else{
        callback(null,0);
    }
}

exports.messageToKu       = function(data,callback){
    pool.query('replace into kk_danmaku_message(cid,uid,openid,checked,voliate,createTime,up,down,type,perform,message) values(?,?,?,?,?,?,?,?,?,?,?)',[data.cid,data.uid,data.openid,1,data.voliate,data.createTime,data.up,data.down,data.type,data.perform,data.message],function(err,result){
        if(err){
            console.log(err);
        }else{
             console.log('insert success');
        }
    });
}

