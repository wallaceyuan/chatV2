var request = require('request');
var async = require('async');
var xss = require('xss');
var emoji = require('emoji');
var debug = require('debug')('mysql:save');


var config = require('../task/config');
var client  = config.client;
var pool  = config.pool;


exports.roomValidateSql   = function(nsp,infoid,callback){
    var sid  = 'infoid';
    pool.query('select t1.id from kk_danmaku_chatrooms as t1,kk_danmaku_namespace as t2 where t2.id = t1.type and namespace = ? and '+sid+' = ? and t1.open = ? and t2.open = ? ',[nsp,infoid,1,1],function(err,rows){
        if(err){
            callback({"status":706,"msg":'room 查询错误'+err},null);
            console.log(5,err);
        }else{
            if(rows.length>0){
                callback(null,'');
            }else{
                callback({"status":302,"msg":'liveroom off'},null);
            }
        }
    });
}

exports.messageValidate   = function(data,callback){
    var res = data.result;
    var codeOpt = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://kankanews.cn-north-1.eb.amazonaws.com.cn/KKShielder',
        method: 'POST',
        body:"words="+res.message
    };
    request(codeOpt,function(err,result,body){
        var body = JSON.parse(body);
        callback(null,body);
    });
}

exports.postServer = function (data,callback) {
    var codeOpt = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://127.0.0.1:3000/violates/check',
        method: 'POST',
        body:"data="+JSON.stringify(data)
    };
    request(codeOpt,function(err,result,body){
        var body = JSON.parse(body);
        if(body.status == 200){
            callback(null,body);
        }else{
            callback({"status":302,"msg":'stop send'}, null);
        }
    });
}
