/**
 * Created by yuan on 2016/4/20.
 */
var redis = require('redis');

exports.socketHallFuc = function(nsp,client) {
    var clients = [];//在线socket
    var users = [];//在线users
    var onlinesum = 0,userName,roomName = '';
    var NSP = '';
    nsp.on('connection',function(socket){

        onlinesum++;

        /*获得在线列表*/
        socket.on('getAllMessages',function(){
            users = users.filter(function(user){
                if(user)
                    return roomName == user.room;
            });
            socket.emit('allMessages',{users:users,onlinesum:onlinesum});
        });

        //监听 客户端的消息
        socket.on('userInit',function(data){
            roomName = data.room,userName = data.user,clients[socket.id] = socket;

            var userData = {name:userName,id: socket.id,room:roomName};

            users.push(userData);

            if(roomName!=''){
                socket.join(roomName);
                nsp.in(roomName).emit('joinChat',userData);
            }else{
                nsp.emit('joinChat',userData);
            }
            NSP = nsp.name == '/'?'root': nsp.name.replace(/\//g, "");
            console.log('nsp',nsp.name,'room',roomName,'connection');
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
            roomName = data.room;
            if(roomName == "" || roomName == null){
                console.log("empty Room");
            }else{
                socket.leave(data.room);
            }
        });

        /*接收redis发来的消息*/
        socket.on('redisCome',function (data,callback) {
            console.log('redisCome',data);
            if(roomName!=''){
                nsp.in(roomName).emit('message.add',data);
            }else{
                nsp.emit('message.add',data);
            }
            //console.log(nsp.name,roomName);
            callback();
        });

        /*用户下线*/
        socket.on('disconnect', function () {
            onlinesum--;
            users = users.filter(function(user){
                if(user)
                    return socket.id != user.id;
            });
            if(socket.id)
                delete clients[socket.id];

            socket.emit('unsubscribe',{"room" : roomName});

            if(roomName!=''){
                nsp.in(roomName).emit('people.del', {user:userName,content:'下线了',onlinesum:onlinesum});
            }else{
                nsp.emit('people.del', {user:userName,content:'下线了',onlinesum:onlinesum});
            }
        });

        /*用户发送消息*/
        socket.on('createMessage',function(data){
            var place = NSP+':'+roomName;
            data.place = place;
            console.log(nsp.name);
            client.lpush('message',JSON.stringify(data),redis.print);
            //nsp.in(roomName).emit('message.add',data);
        });



    });
}

