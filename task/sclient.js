var io = require('socket.io-client');
var async = require('async');
var redis = require('redis');
var xss = require('xss');

//var client  = redis.createClient(6379, 'knews-redis2-001.nrm01e.0001.cnn1.cache.amazonaws.com.cn');
var client  = redis.createClient();
var user = require('../task/user');
var debug = require('debug')('socket-client:main');


//var ip = 'http://54.222.215.248/';
var ip = 'http://127.0.0.1:3000';
var origin = io.connect(ip+'/', {reconnect: true});
var chatroom = io.connect(ip+'/chatroom', {reconnect: true});
var live = io.connect(ip+'/live', {reconnect: true});
var vod = io.connect(ip+'/vod', {reconnect: true});
var wechat = io.connect(ip+'/wechat', {reconnect: true});
var broadcast = io.connect(ip+'/broadcast', {reconnect: true});

//io.adapter(adapter({host:"knews-redis1.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn", port:6379}));
var namBox = {root:origin,chatroom:chatroom,live:live,vod:vod,wechat:wechat,broadcast:broadcast};

process.nextTick(compute);

function compute() {
    var time = getTime();
    client.llen('message', function(error, count){
        if(error){
            console.log(error);
        }else{
            if(count){
                popLogs(count, function(logs){
                    console.log('final: '+ logs);
                });
            }else{
                waithall(100);
                console.log('working for 1s 空的 暂停取数据, nexttick',time);
                process.nextTick(compute);
            }
        }
    });
}

function popLogs(){
    client.rpop('message',function(err,result){
        var result = JSON.parse(result);
        var place = result.place.split(':');
        var nsp = place[0],room = place[1];
        var time = getTime();
        console.log('start'+nsp +room +time);
        result.room = room;

        async.waterfall([
            function(done){
                console.log('sroom');
                user.roomValidateSql(nsp,room,function(err,res){
                    console.log('完成房间验证');
                    done(err,res);
                });
            },
            function(res,done){
                console.log('suser');
                user.userValidateSql({token:result.token,uid:result.uid,client:client},function(err,res){
                    console.log('完成用户验证'/*,res*/);
                    done(err,res);
                });
            },
            function(res,done){
                console.log('ssql');
                user.messageDirty({msg:result.message},function(err,res){
                    console.log('完成注入验证'/*,res*/);
                    done(err,res);
                });
            },
            function(arg,done){
                console.log(arg,'skey');
                user.messageValidate({result:result,client:client},function(err,res){
                    console.log('完成关键词验证'/*,res*/);
                    done(err,res);
                });
            },
        ],function(err,res){

            result.message = xss(result.message).replace(/<[^>]+>/g,"");

            if(err){
                if(parseInt(err.code) == 702){
                    result.voliate = 1;
                }
                if(parseInt(err.code) != 703){
                    user.messageToKu(result);
                }
                if(parseInt(err.code) == 703){
                    console.log('error有注入',err.msg);
                }
                process.nextTick(compute);
            }else{
                console.log('全部完成',res);

                namBox[nsp].emit('redisCome',result,function(){
                    console.log('redisSend, nexttick');
                    user.messageToKu(result);
                    process.nextTick(compute);
                });
            }
        });
    });
}

function waithall(mils){
    var now = new Date;
    while (new Date - now <= mils);
}

function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min+':'+sec
}