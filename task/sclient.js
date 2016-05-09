
var io = require('socket.io-client');
var async = require('async');
var xss = require('xss');
var moment = require('moment');
var emoji = require('emoji');

var user = require('../task/user');
var config = require('../task/config');
var domain = require('domain');
var debug = require('debug')('socket-client:main');


var ip = config.ip;
var client  = config.client;

var origin = io.connect(ip+'/', {reconnect: true});
var chatroom = io.connect(ip+'/chatroom', {reconnect: true});
var live = io.connect(ip+'/live', {reconnect: true});
var vod = io.connect(ip+'/vod', {reconnect: true});
var wechat = io.connect(ip+'/wechat', {reconnect: true});
var broadcast = io.connect(ip+'/broadcast', {reconnect: true});

var namBox = {root:origin,chatroom:chatroom,live:live,vod:vod,wechat:wechat,broadcast:broadcast};


/*var reqDomain = domain.create();
reqDomain.on('error', function (err) {
    console.log('reqDomain',err);
    process.nextTick(compute);
});
reqDomain.run(function () {
    process.nextTick(compute);
});*/

compute();
/*
process.on('uncaughtException', function (err) {
    console.log(err);
    try {
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 30000);
        killTimer.unref();
        server.close();
    } catch (e) {
        console.log('error when exit', e.stack);
    }
});
*/

function compute() {
    var time = moment().unix();
    client.llen('message', function(error, count){
        if(error){
            console.log(error);
        }else{
            if(count){
                console.log('-------------has count',time);
                popLogs();
                process.nextTick(compute);
            }else{
                console.log('-------------empty',time);
                setTimeout(function(){
                    compute();
                },100);
            }
        }
    });
}

function popLogs(){
    console.log('-------------deal-------------');
    client.rpop('message',function(err,result){
        if(err){
            console.log(err);
        }else{
            var result = JSON.parse(result);
            try{
                var place = result.place.split(':');
                console.log('place',result.place);
            }catch(e){
                console.log('空数据',result);
                return;
            }
            var nsp = place[0],room = place[1];
            var time = moment().unix();
            console.log(' start '+' nsp: '+nsp +" room "+room + ' time: '+time);
            result.room = room;
            async.waterfall([
                function(done){
                    console.log('sroom');
                    user.roomValidateSql(nsp,room,function(err,res){
                        console.log('room done');
                        done(err,res);
                    });
                },
                function(res,done){
                    console.log('suser');
                    user.userValidateSql({token:result.token,uid:result.uid},function(err,res){
                        console.log('user done'/*,res*/);
                        done(err,res);
                    });
                },
                function(res,done){
                    console.log('ssql');
                    user.messageDirty({msg:result.message},function(err,res){
                        console.log('sql done'/*,res*/);
                        done(err,res);
                    });
                },
                function(arg,done){
                    console.log(arg,'skey');
                    user.messageValidate({result:result},function(err,res){
                        console.log('key done'/*,res*/);
                        done(err,res);
                    });
                },
            ],function(err,res){
                console.log('-------------result.message:-------------',result.message);
                console.log('result.socketid:',result.socketid);
                if(err){
                    console.log('err!!!!',err);
                    err.room = room;
                    err.socketid = result.socketid;
                    if(parseInt(err.status) == 702){
                        result.message = escape(xss(result.message));
                        result.violate = 1;
                        user.messageToKu(result,function(){
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
                        namBox[nsp].emit('redisCome',result);
                        console.log('result.message',result.message);
                        result.message = escape(xss(emoji.unifiedToText(result.message)));
                        user.messageToKu(result, function () {
                            console.log('-------------redisEmit all done-------------',res);
                        });
                    }else{
                        console.log('error namespace');
                    }
                }
            });
        }
    });
}

function sleep(mils) {
    var now = new Date;
    while (new Date - now <= mils);
    status = true;

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

