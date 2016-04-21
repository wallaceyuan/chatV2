var io = require('socket.io-client');
var debug = require('debug')('socket-client:main');

var redis   = require("redis").createClient.(6379, "knews-redis1.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");


var hall = io.connect('http://localhost:1000/hall', {reconnect: true});
var img = io.connect('http://localhost:1000/img', {reconnect: true});
var comment = io.connect('http://localhost:1000/comment', {reconnect: true});


//io.adapter(adapter({host:"knews-redis1.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn", port:6379}));


var namBox = {hall:hall,img:img,comment:comment};
var nsprBox = [];


hall.on('connect', function() {
    console.log('Connected!');
    process.nextTick(compute);
});

function compute() {
    var time = getTime();
    console.log('start hall computing'+time);
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
                waithall(1000);
                console.log('working for 1s 空的 暂停取数据, nexttick');
                process.nextTick(compute);
            }
        }
    });
}

function popLogs(){
    client.lpop('message',function(err,result){
        var result = JSON.parse(result);
        var place = result.place.split(':');
        var nsp = place[0],room = place[1];
        var time = getTime();
        console.log('start'+nsp +room +time);

        if(nsprBox.indexOf(result.place) == -1){
            nsprBox.push(result.place);
            console.log('加入房间',room);
            namBox[nsp].emit('userConnet',room);
            namBox[nsp].emit('subscribe',{"room" : room});//进入namespace下的房间
        }else{

        }

        namBox[nsp].emit('redisCome',result,function(){
            waithall(0);
            console.log('working for 5s, nexttick');
            process.nextTick(compute);
        });
    });
}


function waithall(mils){
    var now = new Date;
    while (new Date - now <= mils);
}


hall.on('disconnect', function(){
    console.log('hall disconnect!');
});

img.on('disconnect', function() {
    console.log('comment disconnect!');
});

comment.on('disconnect', function() {
    console.log('comment disconnect!');
});

function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min+':'+sec
}