
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
        var black = false,roomName = '',NSP = '',userData,userName;
        socket.on('userInit',function(data){//监听 客户端的消息
            onlinesum++;
            async.waterfall([
                function(done){//用code查询是否被禁言(redis)
                    console.log('svolidate');
                    user.userViolatorRedis({token:data.token,client:client},function(err,res){
                        console.log('evolidate');
                        done(err,res);
                    });
                },
                function(arg,done){//用code检测时候是allow用户（redis/sso）
                    console.log('sallow');
                    user.userAllowedRedis({token:data.token,client:client},function(err,res){
                        console.log('eallow');
                        done(err,res);
                    });
                },
            ],function(err,res){
                if(err){
                    console.log(err);
                    black = true,roomName = data.room
                    if(roomName!=''){
                        socket.join(roomName);
                    }
                    users = users.filter(function(user){
                        if(user)
                            return roomName == user.room;
                    });

                    socket.emit('userStatus',{status:err,users:users,onlinesum:onlinesum});

                }else{
                    black = false;

                    var uif = JSON.parse(res.data);

                    roomName = data.room, userName = uif.nickName,clients[socket.id] = socket;

                    if(data.openid){
                        var openid = data.openid;
                        var token = '';
                    }else{
                        var openid = '';
                        var token = data.token;
                    }
                    userData = {token:token,opneid:openid,id: socket.id,room:roomName,posterURL:uif.posterURL,
                        tel:uif.tel,uid:uif.uid,nickName:userName,onlinesum:onlinesum};

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

                    socket.emit('userStatus',{status:{code:0,msg:'用户验证成功'},userData:userData,users:users,onlinesum:onlinesum});
                }

                NSP = nsp.name == '/'?'root': nsp.name.replace(/\//g, "");

                console.log('所有的任务完成了'/*,res*/);

                //debug('所有的任务完成了',res);
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
            console.log('redisCome'/*,data*/);
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

            //console.log('disconnect',socket.id,users,onlinesum);

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
                var data2 = {
                    openid:userData.openid, token:userData.token, cid: roomName, uid: userData.uid,
                    nickName:userData.nickName,posterURL:userData.posterURL,tel:userData.tel,
                    openid: '',checked:0,voliate:0,createTime:Date.parse(new Date())/1000,
                    place:NSP+':'+roomName
                };
                for(var item in data2){
                    data[item]=data2[item];
                }
                if(data.perform){
                    data.perform = JSON.stringify(data.perform);
                }
                client.lpush('message',JSON.stringify(data),redis.print);
            }
        });

    });
}

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}