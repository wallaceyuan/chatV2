/**
 * Created by Yuan on 2016/4/24.
 */
var request = require('request');
var async = require('async');
var xss = require('xss');
var emoji = require('emoji');
var debug = require('debug')('mysql:save');


var config = require('../task/config');
var client  = config.client;
var pool  = config.pool;

exports.userViolatorRedis = function(data,callback){
    //console.log('kkUserBlack'+data.token);
    client.hgetall('kkUserBlack'+data.token, function (err, obj) {
        if(err){
            callback({"code":706,"msg":'user 19 查询错误'},null);
            console.log(err);
        }else{
            if(obj){
                //console.log('getViolator-you');
                callback({"code":700,"msg":'被禁言用户'},null);
            }else {
                //console.log('getViolator-wu');
                callback(null,0);
            }
        }
    });
}

exports.userViolatorWechatRedis = function(data,callback){
    //console.log('kkUserBlack'+data.token);
    client.hgetall('kkUserBlack'+data.openid, function (err, obj) {
        if(err){
            callback({"code":706,"msg":'user 37 查询错误'},null);
            console.log(2,err);
        }else{
            if(obj){
                //console.log('getViolator-you');
                callback({"code":700,"msg":'被禁言用户'},null);
            }else {
                //console.log('getViolator-wu');
                callback(null,0);
            }
        }
    });
}

exports.userAllowedRedis  = function(data,callback){
    client.hgetall(data.token, function (err, obj) {
        if(err){
            callback({"code":706,"msg":'user 55 查询错误'},null);
            console.log(3,err);
        }else{
            if(obj){
                //console.log('getAllowed-you');
                callback(null,obj);
            }else {
                //console.log('getAllowed-wu');
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
                                callback({"code":706,"msg":'user 74 查询错误'},null);
                                console.log(4,err);
                            }else{
                                console.log("MULTI got " + replies.length + " replies");
                            }
                        });
                        callback(null,body);
                    }else{
                        callback({"code":body.code,"msg":body.msg},null);
                    }
                });
            }
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
        if(uid && users && room){
            var judge = users.filter(function(user){
                if(user)
                    return room == user.room && uid == user.uid;
            });
            if(judge.length > 0){
                callback({"code":704,"msg":'用户在同一个命名空间下的房间内重复登录'},null);
            }else{
                callback(null,0);
            }
        }else{
            callback({"code":704,"msg":'用户在同一个命名空间下的房间内重复登录'},null);
        }
    }
}

exports.roomValidateSql   = function(nsp,infoid,callback){
    var sid  = 'infoid';
    if(nsp == 'wechat')
        sid = 't1.id';

    pool.query('select t1.id from kk_danmaku_chatrooms as t1,kk_danmaku_namespace as t2 where t2.id = t1.type and namespace = ? and '+sid+' = ? and t1.open = ? and t2.open = ? ',[nsp,infoid,1,1],function(err,rows){
        if(err){
            callback({"status":706,"msg":'user 120 查询错误'+err},null);
            console.log(5,err);
        }else{
            if(rows.length>0){
                callback(null,rows[0]);
            }else{
                callback({"status":701,"msg":'没有对应开放的聊天室'},null);
            }
        }
    });
}

exports.userValidateSql   = function(data,callback){

    var voliteToken,sqlStr,queryData;

    if(data.openid){
        voliteToken = data.openid;
    }else{
        voliteToken = data.token;
    }

    client.hgetall('kkUserBlack'+voliteToken, function (err, obj) {
        if(err){
            callback({"status":706,"msg":'user 144 查询错误'},null);
            console.log(6,err);
        }else{
            if(obj){//console.log('kkUserBlack-you');
                callback({"status":700,"msg":'被禁言用户'},null);
            }else {//console.log('kkUserBlack-wu');
                if(data.openid){
                    sqlStr = 'select id from kk_danmaku_violators where openid = ? and free = 0';
                    queryData = data.openid;
                }else{
                    sqlStr = 'select id from kk_danmaku_violators where uid = ? and free = 0';
                    queryData = data.uid;
                }
                pool.query(sqlStr,[queryData],function(err,rows){
                    if(err){
                        callback({"status":706,"msg":'user 159 查询错误'},null);
                        console.log(7,err);
                    }else{
                        if(rows.length>0){
                            client.multi().HMSET('kkUserBlack'+voliteToken, {free:0}).expire('kkUserBlack'+voliteToken,300).exec(function (err, replies) {
                                console.log("MULTI got " + replies.length + " replies");
                            });
                            callback({"status":700,"msg":'被禁言用户'},null);
                        }else{
                            callback(null,{"msg":'OK'});
                        }
                    }
                });
            }
        }
    });
}

exports.messageValidate   = function(data,callback){
    var token,sqlStr,queryData,res = data.result,nickName = res.nickName;
    if(res.openid){
        token = res.openid;
    }else{
        token = res.token;
    }

    var codeOpt = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://kankanews.cn-north-1.eb.amazonaws.com.cn/KKShielder',
        method: 'POST',
        body:"words="+res.message+" "+res.nickName/*,
        body:"words="+res.message*/
    };

    request(codeOpt,function(err,result,body){
        var body = JSON.parse(body);
        if(parseInt(body.size) > 0 ){
            client.multi().HMSET('kkUserBlack'+token, {free:0}).expire('kkUserBlack'+token,300).exec(function (err, replies) {
                if(err){
                    callback({"status":706,"msg":'user 196  查询错误'},null);
                    console.log(8,err);
                }else{
                    //console.log("kkUserBlack set");
                }
            });
            //console.log('validate',res.uid);
            if(res.openid){
                sqlStr = 'update kk_danmaku_violators set free=0 where openid=?';
                queryData = res.openid;
                nickName = nickName+'('+res.openid+')'
            }else{
                sqlStr = 'update kk_danmaku_violators set free=0 where uid=?';
                queryData = res.uid;
            }
            pool.query(sqlStr,[queryData],function(err,result){
                if(err){
                    callback({"status":706,"msg":'user 213 查询错误'},null);
                    console.log(err);
                }else{
                    if(result.changedRows == 0){
                        pool.query('insert into kk_danmaku_violators(uid,openid,tel,nickName,posterURL,createTime,free) values(?,?,?,?,?,?,?)',[res.uid,res.openid,res.tel,nickName,res.posterURL,res.createTime,0],function(err,result){
                            if(err){
                                callback({"status":706,"msg":'user 219 查询错误'},null);
                                console.log(9,err);
                            }else{
                                //console.log(result);
                            }
                        });
                    }
                }
            });
            callback({"status":702,"msg":'存在敏感词'},null);
        }else{
            callback(null,0);
        }
    });
}

exports.messageDirty      = function(message,callback){
    //console.log(message.msg);
    var re = /select|update|delete|exec|count|=|;|>|<|%/i;
    if (re.test(message.msg)) {//特殊字符和SQL关键字
        //console.log('存在特殊字符');
        callback({"status":703,"msg":'存在特殊字符'},null);
    }else{
        callback(null,0);
    }
}

exports.messageToKu       = function(data,callback){
    var unicode2 = decToHex(escape(xss(data.message)));
    data.message = '"' + unicode2 + '"';
    var place = data.place.split(':');
    var nsp = place[0];

    var sid  = 'infoid';
    if(nsp == 'wechat')
        sid = 'id';

    pool.query('select id from kk_danmaku_chatrooms where '+sid+' = ?',[data.cid],function(err,rows){
        if(err){
            callback({"status":706,"msg":'user 257 查询错误'},null);
            console.log(10,err);
        }else{
            pool.query('insert into kk_danmaku_message(cid,uid,openid,checked,violate,createTime,up,down,type,perform,message,nickName,posterURL) values(?,?,?,?,?,?,?,?,?,?,?,?,?)',[rows[0].id,data.uid,data.openid,0,data.violate,data.createTime,data.up,data.down,data.type,data.perform,data.message,data.nickName,data.posterURL],function(err,result){
                if(err){
                    callback({"status":706,"msg":'user 263 查询错误'},null);
                    console.log(11,err);
                }else{
                    console.log('insert success');
                    callback(null,200);
                }
            });
        }
    });

}

var decToHex = function(str) { //unicode编码
    var res=[];
    for(var i=0;i < str.length;i++)
        res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u"+res.join("\\u");
}

var hexToDec = function(str) { //unicode解码
    str=str.replace(/\\/g,"%");
    return unescape(str);
}

function escape(html) {
    return String(html)
        .replace(/<[^>]+>/g,"")
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;'); // IE􁀰不支持&apos;􀇄单引􀡽􀇅转义
};

