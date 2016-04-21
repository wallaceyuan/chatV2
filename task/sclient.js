var io = require('socket.io-client');
var debug = require('debug')('socket-client:main');

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
    socket.emit('redisCome',{"user": "yy","message": 67676,'time':"14:23","place": "hall:aa"},function(){
        waithall(5000);
        console.log('working for 5s, nexttick');
        process.nextTick(compute);
    });
}

/*var socketimg = io.connect('http://localhost:1000/img', {reconnect: true});
socketimg.on('connect', function(socketimg) {
    console.log('Connected!');
    process.nextTick(computeimg);
});
socketimg.emit('subscribe',{"room" : 'aa'});//进入chat房间


function waitimg(mils){
    var now = new Date;
    while (new Date - now <= mils);
}
function computeimg() {
    var time = getTime();
    console.log('start img computing'+time);
    socketimg.emit('redisCome',{time:time,msg:'start img computing'},function(){
        waitimg(5000);
        console.log('working for 1s, nexttick');
        process.nextTick(computeimg);
    });
}*/

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