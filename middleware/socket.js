/**
 * Created by yuan on 2016/4/20.
 */

var redisio = require('socket.io-redis');
//var client   = require("redis").createClient(6379, "knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");
var client   = require("redis").createClient();

var socketF = require('./socketfunc');

exports.socketio = function(server) {

    var io = require('socket.io')(server);

    var hallSpaceName = '/hall';

    var commentSpaceName = '/comment';

    var imgSpaceName = '/img';

    //io.adapter(adapter({host:"knews-redis1.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn", port:6379}));

    var hnsp = io.of(hallSpaceName);

    socketF.socketHallFuc(hnsp,client);

    var cnsp = io.of(commentSpaceName);

    socketF.socketHallFuc(cnsp,client);

    var insp = io.of(imgSpaceName);

    socketF.socketHallFuc(insp,client);
}
