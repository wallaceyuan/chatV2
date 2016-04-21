

var redis = require('redis');
var client  = redis.createClient(6379, '127.0.0.1');
var io = require('socket.io-client');
var debug = require('debug')('socket-client:main');


/*hall*/
var shall = io.connect('http://localhost:1000/hall', {reconnect: true});
var scomment = io.connect('http://localhost:1000/comment', {reconnect: true});
var simg = io.connect('http://localhost:1000/img', {reconnect: true});

var nsprBox = [];

compute();

function wait(mils){
    var now = new Date;
    while (new Date - now <= mils);
}

function compute() {
    var time = getTime();
    console.log('start hall computing'+time);
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

    console.log('working for 1s, nexttick');
    process.nextTick(compute);

}



function socketProcess(nsp,result){
    var key = result.place;
    var room = result.place.split(':')[1];
    console.log('key',key,'array',nsprBox,'index',nsprBox.indexOf(key));
    if(nsprBox.indexOf(key) == -1){
        nsprBox.push(key);
        nsp.emit('subscribe',{"room" : room});//进入namespace下的房间
    }else{

    }

    nsp.emit('redisCome',result);

    console.log(nsprBox);
}

function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min+':'+sec
}

