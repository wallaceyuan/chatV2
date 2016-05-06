
var config = require('../task/config');
var socketF = require('./socketfunc');
var redis = require('socket.io-redis');

var client = config.client;
var host = config.host;

exports.socketio = function(server) {

    var io = require('socket.io')(server);

    io.adapter(redis({host: host, port: 6379}));

    var nameBox = ['/chatroom','/live','/vod','/wechat','/broadcast'];

    for(var item in nameBox){

        var lnsp = io.of(nameBox[item]);

        socketF.socketHallFuc(lnsp,client);
    }
}
