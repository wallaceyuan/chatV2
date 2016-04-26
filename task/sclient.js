var io = require('socket.io-client');
var async = require('async');
var redis = require('redis');

//var client  = redis.createClient(6379, 'knews-redis2-001.nrm01e.0001.cnn1.cache.amazonaws.com.cn');
var client  = redis.createClient();
var user = require('../task/user');
var debug = require('debug')('socket-client:main');

/*dev*/
/*
var origin = io.connect('http://54.222.215.248/', {reconnect: true});
var hall = io.connect('http://54.222.215.248/hall', {reconnect: true});
var img = io.connect('http://54.222.215.248/img', {reconnect: true});
var comment = io.connect('http://54.222.215.248/comment', {reconnect: true});
*/

/*localhost*/
//var origin = io.connect('http://127.0.0.1:3000/', {reconnect: true});
var live = io.connect('http://127.0.0.1:3000/live', {reconnect: true});
var cod = io.connect('http://127.0.0.1:3000/cod', {reconnect: true});
var chatroom = io.connect('http://127.0.0.1:3000/chatroom', {reconnect: true});

//io.adapter(adapter({host:"knews-redis1.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn", port:6379}));
var namBox = {/*root:origin,*/live:live,cod:cod,chatroom:chatroom};

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
                user.roomValidateSql(nsp,room,function(err,res){
                    console.log('完成房间验证');
                    done(err,res);
                });
            },
            function(res,done){
                user.userValidateSql({code:result.code,uid:result.uid,client:client},function(err,res){
                    console.log('完成用户验证',res);
                    done(err,res);
                });
            },
            function(res,done){
                user.messageValidate({result:result,client:client},function(err,res){
                    console.log('完成关键词验证',res);
                    done(err,res);
                });
            },
        ],function(err,res){
            if(err){
                console.log(err);
                result.voliate = 1;
                user.messageToKu(result);
                process.nextTick(compute);
            }else{
                console.log('全部完成',res);
                namBox[nsp].emit('redisCome',result,function(){
                    console.log('redisSend, nexttick');
                    result.voliate = 0;
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



/*hall.on('disconnect', function(){
    console.log('hall disconnect!');
});

img.on('disconnect', function() {
    console.log('comment disconnect!');
});

comment.on('disconnect', function() {
    console.log('comment disconnect!');
});*/

function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min+':'+sec
}