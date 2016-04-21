var io = require('socket.io-client');
var debug = require('debug')('socket-client:main');

var redis = require('redis');
var client  = redis.createClient(6379, '127.0.0.1');

/*hall*/
var socket = io.connect('http://localhost:1000/hall', {reconnect: true});
socket.on('connect', function(socket) {
    console.log('Connected!');
    process.nextTick(compute);
});
socket.emit('userConnet','aa');
socket.emit('subscribe',{"room" : 'aa'});//进入chat房间

function waithall(mils){
    var now = new Date;
    while (new Date - now <= mils);
}

function compute() {
    var time = getTime();
    console.log('start hall computing'+time);
    client.rpop('message',function(err,result){
        var result = JSON.parse(result);
        socket.emit('redisCome',result,function(){
            waithall(1000);
            console.log('working for 5s, nexttick');
            process.nextTick(compute);
        });
    });
}

socket.on('disconnect', function(){

});

function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min+':'+sec
}