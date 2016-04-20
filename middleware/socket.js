/**
 * Created by yuan on 2016/4/20.
 */

var redis = require('socket.io-redis');

var socketF = require('./socketfunc');

exports.socketio = function(server) {

    var io = require('socket.io')(server);

    var hallSpaceName = '/hall';

    var commentSpaceName = '/comment';

    var imgSpaceName = '/img';

    io.adapter(redis({ host: 'localhost', port: 6379 }));

    var hnsp = io.of(hallSpaceName);

    socketF.socketHallFuc(hnsp);

    var cnsp = io.of(commentSpaceName);

    socketF.socketHallFuc(cnsp);

    var insp = io.of(imgSpaceName);

    socketF.socketHallFuc(insp);
}
