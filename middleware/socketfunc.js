/**
 * Created by yuan on 2016/4/20.
 */
var redis = require('redis');
var User = require('../model/user');
var request = require('request');

exports.socketHallFuc = function(nsp,client) {
    var clients = [];//在线socket
    var users = [];//在线users
    var onlinesum = 0,userName,roomName = '';
    var NSP = '';
    nsp.on('connection',function(socket){

        //监听 客户端的消息
        socket.on('userInit',function(data){
            client.hgetall(data.code, function (err, obj) {
                if(obj){
                    console.log('you',obj);
                }else{
                    request({url:'http://127.0.0.1:3000/chats/user/'+data.code},function(err,res,body){
                        console.log('wu',JSON.parse(body)[0]);
                        var data = JSON.parse(body)[0];
                        if(data){
                            client.HMSET(data.code, data);
                        }else{
                            console.log('用户不合法');
                        hh    setTimeout(function(){
                                socket.disconnect();
                            },2000);
                            return;
                        }
                    });
                }
                onlinesum++;
                roomName = data.room,userName = data.user,clients[socket.id] = socket;
                var userData = {name:userName,id: socket.id,room:roomName};
                users.push(userData);
                if(roomName!=''){
                    socket.join(roomName);
                    socket.broadcast.in(roomName).emit('joinChat',userData);
                }else{
                    socket.broadcast.emit('joinChat',userData);
                }

                users = users.filter(function(user){
                    if(user)
                        return roomName == user.room;
                });
                socket.emit('allMessages',{users:users,onlinesum:onlinesum});

                NSP = nsp.name == '/'?'root': nsp.name.replace(/\//g, "");
                console.log('nsp',nsp.name,'room',roomName,'connection','userData',userData);

            });


        });

        /*订阅房间*/
        socket.on('subscribe', function(data) {
            roomID = data.room;
            if(roomID == "" || roomID == null){
                //console.log("empty Room");
            }else{
                socket.join(data.room);
               // console.log(socket.id,'subscribe',roomID);
            }
        });
        /*取消订阅房间*/
        socket.on('unsubscribe', function(data) {
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
            callback();
        });

        /*用户下线*/
        socket.on('disconnect', function () {
            onlinesum--;
            users = users.filter(function(user){
                if(user)
                    return socket.id != user.id;
            });
            console.log('disconnect',socket.id,users);
            if(socket.id)
                delete clients[socket.id];

            socket.emit('unsubscribe',{"room" : roomName});

            if(roomName!=''){
                socket.broadcast.in(roomName).emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
            }else{
                socket.broadcast.emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
            }
        });

        /*用户发送消息*/
        socket.on('createMessage',function(data){
            data.place =  NSP+':'+roomName;
            client.lpush('message',JSON.stringify(data),redis.print);
        });

    });
}

