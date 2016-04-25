/**
 * Created by Yuan on 2016/4/20.
 */
var redis = require('redis');
var client  = redis.createClient(6379, '127.0.0.1');
var io = require('socket.io-client');
var debug = require('debug')('redis-test:main');

/*hall scomment simg*/
var hall = io.connect('http://localhost:1000/hall', {reconnect: true});
var comment = io.connect('http://localhost:1000/comment', {reconnect: true});
var img = io.connect('http://localhost:1000/img', {reconnect: true});


var nsprBox = [];

function redisCount(){
    client.llen('message', function(error, count){
        if(error){
            console.log(error);
        }else{
            if(count){
                popLogs(count, function(logs){
                    console.log('final: '+ logs);
                });
            }else{
                console.log('空的 暂停取数据1s');
            }
        }
    });
}


function popLogs(count, callback){
    var logs = [];
    for (var i=1; i<=10; i++) {
        client.lpop('message', function(err, value){
            console.log(value);
            logs.push({'log':value});
        });
    };
    callback(logs);
}

redisCount();

/*client.llen('buffer', function(error, count){
    popLogs(count, function(logs){
        console.log('final: '+ logs);
    });
});*/
/*client.LRANGE('y111y', function(err) {
    if(err){
        console.log(err);
    }else{
        console.log('成功');
    }
});*/


/*for(var i = 0;i<500;i++){
    var data = {user:'yy',message:67676,time:getTime,place:'comment:aa'};
    client.lpush('message',JSON.stringify(data),redis.print);
}*/

/*
client.rpop('message',function(err,result){
        var result = JSON.parse(result);
        var place = result.place.split(':');
        var nsp = place[0],room = place[1];
        switch(nsp) {
            case 'hall':
                socketProcess(hall,result);
                console.log('hall');
                break;
            case 'comment':
                socketProcess(comment,result);
                console.log('comment');
                break;
            case 'img':
                socketProcess(comment,result.place,room);
                console.log('img');
                break;
            default:
                console.log('default');
        }
    });
*/

/*console.log(client.llen('yy'));
client.exists('testlist');*/

function socketProcess(nsp,result){
    var key = result.place;
    var room = result.place.split(':')[1];
    console.log('key',key,'array',nsprBox,'index',nsprBox.indexOf(key));
    if(nsprBox.indexOf(key) == -1){
        nsprBox.push(key);
        nsp.emit('subscribe',{"room" : room});//进入namespace下的房间
    }else{

    }

    nsp.emit('redisCome',result,function(){
        wait(0);
    });

    console.log(nsprBox);
}
function wait(mils){
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
/*subscribe message*/

/*
var msg_count = 0;

sub.on("subscribe", function (channel, count) {
    pub.publish("a nice channel", "I am sending a message.");
    pub.publish("a nice channel", "I am sending a second message.");
    pub.publish("a nice channel", "I am sending my last message.");
});

sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    msg_count += 1;
    if (msg_count === 3) {
        sub.unsubscribe();
        sub.quit();
        pub.quit();
    }
});

sub.subscribe("a nice channel");*/
