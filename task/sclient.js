
var io = require('socket.io-client');
var async = require('async');
var moment = require('moment');
var redis = require('redis');

var config = require('../task/config');
var asy = require('../task/asyncTask.js');


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
var livetest = io.connect(ip+'/livetest', {reconnect: true});
var service = io.connect(ip+'/service', {reconnect: true});

var namBox = {'root':origin,'chatroom':chatroom,'live':live,'vod':vod,'wechat':wechat,'broadcast':broadcast,'livetest':livetest,'service':service};

//错误捕获
var reqDomain = domain.create();
reqDomain.on('error', function (err) {
    console.log(err);
    try {
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 100);
        killTimer.unref();
    } catch (e) {
        console.log('error when exit', e.stack);
    }
});
reqDomain.run(function () {
    compute();
});


process.on('uncaughtException', function (err) {
    console.log(err);
    try {
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 100);
        killTimer.unref();
    } catch (e) {
        console.log('error when exit', e.stack);
    }
});

function compute() {
    client.llen('message', function(error, count){
        if(error){
            console.log(error);
        }else{
            if(count){
                //console.log('-------------has count',time);
                popLogs();
                process.nextTick(compute);
            }else{
                //console.log('-------------empty',time);
                setTimeout(function(){
                    compute();
                },100);
            }
        }
    });
}

function popLogs(){
    var time = moment().unix();
    console.log('-------------dealStart-------------',time);
    client.rpop('message',function(err,result){
        var result = JSON.parse(result);
        try{
            var place = result.place.split(':');
            //console.log('place',result.place);
        }catch(e){
            console.log('empty data',result);
            return;
        }
        var nsp = place[0],room = place[1];
        result.room = room;

        if(err){
            console.log(err);
        }else{
            if(nsp == 'service'){
                asy.selogic(result,namBox)
            }else{
                asy.kklogic(result,namBox)
            }
        }
    });
}

