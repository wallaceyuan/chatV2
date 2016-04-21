/**
 * Created by yuan on 2016/4/20.
 */

exports.socketio = function(server) {
    var redis = require('socket.io-redis');
    var messages = [];//全部消息（暂时无用）
    var clients = [];//在线socket
    var users = [];//在线users
    var ptp = [];//正在私聊的
    var onlinesum = 0;
    var io = require('socket.io')(server);

    io.adapter(redis({ host: 'localhost', port: 6379 }));

    var nsp = io.of('/hall');

    nsp.on('connection',function(socket){

        var username;
        onlinesum++;
        //监听 客户端的消息

        socket.join('chat');//进入chat房间

        socket.on('redisCome',function (data,callback) {
            nsp.emit('message.add',{user:'系统',message:'我是另外一个node发来的消息'+data.time,time:''});
            callback();
        });

        socket.on('userConnet',function(){
            console.log('userConnet');
        })

        socket.on('message',function(msg){
            var result = msg.match(/^@(.+)\s(.+)$/);
            if(result){
                var toUser = result[1];
                var content = result[2];
                if(clients[toUser]){//通过用户名把对应的socket取出来
                    clients[toUser].send({user:username,content:'[私聊]'+content});
                }else{
                    socket.send({user:'系统',content:'你想私聊的人不在线'});
                }
            }
        })

        socket.on('joinRoom', function (data) {
            if(ptp.indexOf(data.ptop)>-1){
                socket.emit('online');
                return
            }else{
                if(clients[data.ptop]){//通过用户名把对应的socket取出来
                    ptp.push(data.ptop,data.host);
                    clients[data.ptop].emit('initInto',data);
                    socket.emit('gotochat',data);
                    socket.join(data.room);
                }else{
                    io.emit('message.add',{user:'系统',message:'你想私聊的人不在线',time:''});
                    //socket.emit('message.add',{user:'系统',message:'你想私聊的人不在线',time:''});
                }
            }

        });

        socket.on('initInto',function(room){
            socket.join(room);
        });

        socket.on('rMessage',function(data){
            nsp.sockets.in(data.room).emit('privte Message',data);
        });

        /*用户下线*/
        socket.on('disconnect', function () {
            onlinesum--;
            users = users.filter(function(user){
                if(user)
                    return username != user.name;
            });
            if(username)
                delete clients[username];
            socket.broadcast.emit('people.del', {name:username,content:'下线了',onlinesum:onlinesum});
        });

        socket.on('createMessage',function(data){
            //messages.push(data.message);
            nsp.emit('message.add',data);
        });

        /*获得在线列表*/
        socket.on('getAllMessages',function(){
            socket.emit('allMessages',{users:users,onlinesum:onlinesum});
        });

        /*用户加入*/
        socket.on('join',function(me){
            username = me;
            clients[username] = socket;
            users.push({name:me,icon:false,id: socket.id});
            nsp.emit('joinChat',{name:me,icon:false,onlinesum:onlinesum});
        });

    });
}
