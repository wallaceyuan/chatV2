/**
 * Created by yuan on 2016/4/20.
 */

var redisio = require('socket.io-redis');
var redis = require('redis');
var client  = redis.createClient(6379, '127.0.0.1');
var socketF = require('./socketfunc');

exports.socketio = function(server) {

    var io = require('socket.io')(server);

    var hallSpaceName = '/hall';

    var commentSpaceName = '/comment';

    var imgSpaceName = '/img';

    io.adapter(redisio({ host: 'localhost', port: 6379 }));

    var hnsp = io.of(hallSpaceName);

    socketF.socketHallFuc(hnsp,client);

    var cnsp = io.of(commentSpaceName);

    socketF.socketHallFuc(cnsp,client);

    var insp = io.of(imgSpaceName);

    socketF.socketHallFuc(insp,client);
}
