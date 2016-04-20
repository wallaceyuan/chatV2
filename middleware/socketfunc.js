/**
 * Created by yuan on 2016/4/20.
 */

exports.socketHallFuc = function(nsp) {
    var clients = [];//在线socket
    var users = [];//在线users
    var onlinesum = 0;

    nsp.on('connection',function(socket){
        onlinesum++;
        var username;
        var roomName;
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

