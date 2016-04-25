
var redis = require('redis');
var user = require('../task/user');
var request = require('request');
var async = require('async');
var debug = require('debug')('socketfunc:save');


var clients = [];//在线socket
var users = [];//在线users
var onlinesum = 0;

exports.socketHallFuc = function(nsp,client) {
    nsp.on('connection',function(socket){
        var black = false,userName,roomName = '',NSP = '';
        socket.on('userInit',function(data){//监听 客户端的消息
            onlinesum++;
            async.waterfall([
                function(done){//得到code和用户信息
                    user.getCode({code:data.code,client:client},function(err,res){
                        done(err,res);
                    });
                },
                function(arg,done){//对用户进行验证
                    var uid = JSON.parse(arg.data).uid;
                    user.userValidate({uid:uid,client:client},function(err,res){
                        arg.free = '0';
                        done(err,arg);
                    });
                },
            ],function(err,res){
                if(err){
                    console.log(err);
                    black = true,roomName = data.room
                    if(roomName!=''){
                        socket.join(roomName);
                    }
                    //debug('所有的任务完成了',res);
                    users = users.filter(function(user){
                        if(user)
                            return roomName == user.room;
                    });
                    socket.emit('allMessages',{users:users,onlinesum:onlinesum});
                }else{
                    black = false;
                    console.log('所有的任务完成了'/*,res*/);
                    var uif = JSON.parse(res.data);
                    roomName = data.room,userName = data.user,clients[socket.id] = socket;
                    var userData = {name:userName,id: socket.id,room:roomName,posterURL:uif.posterURL,tel:uif.tel,uid:uif.uid,nickName:uif.nickName};
                    userData.onlinesum = onlinesum;
                    users.push(userData);
                    if(roomName!=''){
                        socket.join(roomName);
                        socket.broadcast.in(roomName).emit('joinChat',userData);
                    }else{
                        socket.broadcast.emit('joinChat',userData);
                    }
                    //debug('所有的任务完成了',res);
                    users = users.filter(function(user){
                        if(user)
                            return roomName == user.room;
                    });
                    socket.emit('allMessages',{users:users,onlinesum:onlinesum});
                }

                NSP = nsp.name == '/'?'root': nsp.name.replace(/\//g, "");

                //console.log('nsp',nsp.name,'room',roomName,'connection','userData',userData);

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
            if(data.room!=''){
                nsp.in(data.room).emit('message.add',data);
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
            console.log('disconnect',socket.id,users,onlinesum);
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
            if(black){
                return
            }else{
                console.log(data);
/*                data.cid = roomName;
                data.uid = userData.uid;

                cid：房间id（关联chatroomid）
                uid：看看用户id
                openid：微信openid
                checked：是否审核 0：未审核 1：审核
                voliate：是否违规 0：无违规 1：违规
                createTime：生成时间戳
                type：类型
                perform：弹幕表现形式（json 颜色等）
                message：文本*/
                data.place =  NSP+':'+roomName;
                //data.posterURL = userData.posterURL;
                client.lpush('message',JSON.stringify(data),redis.print);
            }
        });

    });
}



function getUser(uid,callback){
    var userOpt = {
        uri: 'http://ums.kankanews.com/t/getUserInfo.do',
        method: 'POST',
        body :uid,
        headers: {'Content-Type': 'text/xml'}
    }
    request(userOpt,function(err,res,body){
        callback(null,body);
    });
}


