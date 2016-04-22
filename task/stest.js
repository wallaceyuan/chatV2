var io = require('socket.io-client');
var debug = require('debug')('socket-test:main');

var redis = require('redis');

var client  = redis.createClient(6379, 'knews-redis2-001.nrm01e.0001.cnn1.cache.amazonaws.com.cn');
//var client  = redis.createClient();

var hall = io.connect('http://54.222.215.248/hall', {reconnect: true});
//var hall = io.connect('http://127.0.0.1:3000/hall', {reconnect: true});

hall.on('connect', function() {
    console.log('Connected!');
    hall.emit('userConnet','aa');
    hall.emit('subscribe',{"room" : 'aa'});//进入namespace下的房间
    process.nextTick(compute);
});

function compute() {
    var time = getTime();
    console.log('start hall computing'+time);
    var data = {user:'userTest',message:'testMessage',time:getTime(),place:'hall:aa'};
    client.lpush('message',JSON.stringify(data),redis.print);
    wait(10000);
    process.nextTick(compute);
}

function wait(mils){
    var now = new Date;
    while (new Date - now <= mils);
}

hall.on('disconnect', function(){
    console.log('hall disconnect!');
});


function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min+':'+sec
}