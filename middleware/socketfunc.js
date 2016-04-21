/**
 * Created by yuan on 2016/4/20.
 */
var redis = require('redis');

exports.socketHallFuc = function(nsp,client) {
    var clients = [];//在线socket
    var users = [];//在线users
    var onlinesum = 0;

    nsp.on('connection',function(socket){

        console.log(nsp.name,'connection');

        var NSP = nsp.name.replace(/\//g, ""),roomName,username,roomID;

        onlinesum++;

        //监听 客户端的消息
        socket.on('userConnet',function(room){
            console.log('userConnet',room);
            roomID = room;
            if(roomID == "" || roomID == null){

            }else{
                roomName = room;
            }
        });

        /*订阅房间*/
        socket.on('subscribe', function(data) {
            roomID = data.room;
            if(roomID == "" || roomID == null){
                console.log("empty Room");
            }else{
                socket.join(data.room);
                console.log(socket.id,'subscribe',roomID);
            }
        });

        /*取消订阅房间*/
        socket.on('unsubscribe', function(data) {
            console.log('加入房间',data.room);
            roomID = data.room;
            if(roomID == "" || roomID == null){
                console.log("empty Room");
            }else{
                socket.leave(data.room);
                //nsp.to(roomID).emit("receive", {message:"Someone Send Message \"" + obj.message + "\" In " + roomID});
            }
        });

        /*接收redis发来的消息*/
        socket.on('redisCome',function (data,callback) {
            console.log('redisCome',data);
            console.log(nsp.name,roomName);
            nsp.in(roomName).emit('message.add',data);
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

        /*用户发送消息*/
        socket.on('createMessage',function(data){
            var place = NSP+':'+roomName;
            data.place = place;
            client.lpush('message',JSON.stringify(data),redis.print);
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

