
var redisio = require('socket.io-redis');

//var client = require("redis").createClient(6379, "knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");

var client   = require("redis").createClient();

var socketF = require('./socketfunc');

exports.socketio = function(server) {

    var io = require('socket.io')(server);

    //var rootSpaceName = '/';
    //var root = io.of(rootSpaceName);
    //socketF.socketHallFuc(root,client);
    //io.adapter(adapter({host:"knews-redis1.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn", port:6379}));

    var nameBox = ['/chatroom','/live','/vod','/wechat','/broadcast'];

    for(var item in nameBox){

        var lnsp = io.of(nameBox[item]);

        socketF.socketHallFuc(lnsp,client);
    }

/*
    var chatroomSpaceName = '/chatroom';

    var liveSpaceName = '/live';

    var vodSpaceName = '/vod';

    var wechatSpaceName = '/wechat';

    var broadcastSpaceName = 'broadcast';

   var lnsp = io.of(liveSpaceName);

    socketF.socketHallFuc(lnsp,client);

    var vnsp = io.of(vodSpaceName);

    socketF.socketHallFuc(vnsp,client);

    var cnsp = io.of(chatroomSpaceName);

    socketF.socketHallFuc(cnsp,client);*/
}
