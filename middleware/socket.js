
var config = require('../task/config');
var socketF = require('./socketfunc');

var client = config.client;

exports.socketio = function(server) {

    var io = require('socket.io')(server);

    var nameBox = ['/chatroom','/live','/vod','/wechat','/broadcast'];

    for(var item in nameBox){

        var lnsp = io.of(nameBox[item]);

        socketF.socketHallFuc(lnsp,client);
    }
}
