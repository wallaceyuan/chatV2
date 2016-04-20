/**
 * Created by yuan on 2016/4/20.
 */

exports.socketHallFuc = function(nsp) {
    var clients = [];//在线socket
    var users = [];//在线users
    var ptp = [];//正在私聊的
    var onlinesum = 0;
    var room = [];


    nsp.on('connection',function(socket){
        onlinesum++;
        var username;
        var roomName = 124;
        //监听 客户端的消息
        socket.on('userConnet',function(room){
            roomName = room;
            console.log('userConnet',room);
        });

        /*订阅*/
        socket.on('subscribe', function(data) {
            socket.join(data.room);
        });

        /*取消订阅*/
        socket.on('unsubscribe', function(data) {
            socket.leave(data.room);
        });

        socket.on('redisCome',function (data,callback) {
            nsp.in(roomName).emit('message.add',{user:'系统',message:data.msg+data.time,time:''});
            callback();
        });

        ///////
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
        /////

        /*用户下线*/
        socket.on('disconnect', function () {
            onlinesum--;
            users = users.filter(function(user){
                if(user)
                    return username != user.name;
            });
            if(username)
                delete clients[username];

            socket.emit('unsubscribe',{"room" : roomName});

            nsp.emit('people.del', {user:username,content:'下线了',onlinesum:onlinesum});
        });

        socket.on('leaveRoom',function(){
            socket.leave(roomName);
        });

        socket.on('createMessage',function(data){
            //messages.push(data.message);
            nsp.in(roomName).emit('message.add',data);
        });

        /*获得在线列表*/
        socket.on('getAllMessages',function(){
            users = users.filter(function(user){
                if(user)
                    return roomName == user.room;
            });
            socket.emit('allMessages',{users:users,onlinesum:onlinesum});
        });

        /*用户加入*/
        socket.on('join',function(me){
            username = me.user;
            clients[username] = socket;
            users.push({name:me.user,icon:false,id: socket.id,room:me.room});
            nsp.in(roomName).emit('joinChat',{name:me.user,icon:false,onlinesum:onlinesum});
        });
    });
}

