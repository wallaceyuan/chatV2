var io = require('socket.io-client');
var socket = io.connect('http://localhost:1000', {reconnect: true});
var debug = require('debug')('socket-client:main');

var wait = function (mils) {
    var now = new Date;
    while (new Date - now <= mils);
};
socket.on('connect', function(socket) {
    console.log('Connected!');
    process.nextTick(compute);
});

function compute() {
    var time = getTime();
    console.log('start computing'+time);
    socket.emit('redisCome',{time:time},function(){
        wait(1000);
        console.log('working for 1s, nexttick');
        process.nextTick(compute);
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

