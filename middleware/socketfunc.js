var redis = require('redis');
var user = require('../task/user');
var request = require('request');
var async = require('async');
var debug = require('debug')('socketfunc:save');
var moment = require('moment');


var clients = [];//在线socket
var users = [];//在线users
var onlinesum = 0;

exports.socketHallFuc = function(nsp,client) {
    nsp.on('connection',function(socket){
        var black = false,roomName = '',userData,appUserData,userName,
        NSP = nsp.name == '/'?'root': nsp.name.replace(/\//g, "");
        socket.on('userInit',function(data){//监听 客户端的消息
            async.waterfall([
                function(done){//用code查询是否被禁言(redis)
                    console.log('svolidate');
                    user.userViolatorRedis({token:data.token},function(err,res){
                        console.log('evolidate');
                        done(err,res);
                    });
                },
                function(arg,done){//用code检测时候是allow用户（redis/sso）
                    console.log('sallow');
                    user.userAllowedRedis({token:data.token},function(err,res){
                        console.log('eallow');
                        done(err,res);
                    });
                },
                function(arg,done){/*检查用户是否在同一个命名空间下的房间内重复登录*/
                    roomName = data.room;
                    users = users.filter(function(user){
                        if(user)
                            return roomName == user.room;
                    });
                    var mivar = JSON.parse(arg.data);
                    user.userRoomIn({uid:mivar.uid,users:users},function(err,res){
                        console.log('euserin',res);
                        done(err,arg);
                    });
                }
            ],function(err,res){
                if(err){
                    console.log(err);
                    black = true;
                    if(roomName!=''){
                        socket.join(roomName);
                    }
                    users = users.filter(function(user){
                        if(user)
                            return roomName == user.room;
                    });

                    roomClientNum(nsp,roomName,function(num){
                        onlinesum = num;
                    });

                    socket.emit('userWebStatus',{status:err.code,msg:err.msg,users:users,onlinesum:onlinesum});

                    socket.emit('userStatus',{status:err.code,msg:err.msg});

                }else{
                    black = false;
                    /*将数组封装成用户信息*/
                    var uif = JSON.parse(res.data);

                    roomName = data.room, userName = uif.nickName,clients[socket.id] = socket;

                    if(data.openid){
                        var openid = data.openid,token = '';
                    }else{
                        var openid = '',token = data.token;
                    }

                    if(roomName!=''){
                        socket.join(roomName);
                    }

                    roomClientNum(nsp,roomName,function(num){
                        onlinesum = num;
                    });

                    userData = {token:token,opneid:openid,id: socket.id,room:roomName,posterURL:uif.posterURL,
                        tel:uif.tel,uid:uif.uid,nickName:userName,onlinesum:onlinesum};

                    appUserData = {nickName:userName,posterURL:uif.posterURL};

                    if(roomName!=''){
                        socket.broadcast.in(roomName).emit('joinChat',userData);
                    }else{
                        socket.broadcast.emit('joinChat',userData);
                    }

                    users.push(userData);

                    users = users.filter(function(user){
                        if(user)
                            return roomName == user.room;
                    });

                    socket.emit('userStatus',{status:0,msg:'用户验证成功',userData:appUserData});

                    socket.emit('userWebStatus',{status:0,msg:'用户验证成功',userData:userData,users:users,onlinesum:onlinesum});

                }

                console.log('所有的任务完成了'/*,res*/);
                //debug('所有的任务完成了',res);
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
            var msgInfo = {"message":data.message,"createTime":data.createTime,
                "type":data.type,"up":data.up,
                "down":data.down,"perform":data.perform,
                "nickName":data.nickName,"posterURL":data.posterURL,
            }
            if(data.room!=''){
                nsp.in(data.room).emit('message.add',msgInfo);
            }else{
                nsp.emit('message.add',msgInfo);
            }
            callback();
        });

        /*接收redis错误信息返回*/
        socket.on('messageError',function(data,callback){
            console.log('messageError',data);
            var err = {status:data.status,msg:data.msg}
            if(data.room!=''){
                nsp.in(data.room).emit('message.error',err);
            }else{
                nsp.emit('message.error',err);
            }
            callback();
        });

        /*用户下线*/
        socket.on('disconnect', function () {

            users = users.filter(function(user){
                if(socket.id == user.id){
                    //roomClientNum(nsp,roomName);
                }
                if(user)
                    return socket.id != user.id;
            });

            //console.log('disconnect',socket.id,users,onlinesum);
            if(socket.id)
                delete clients[socket.id];

            socket.emit('unsubscribe',{"room" : roomName});


            roomClientNum(nsp,roomName,function(num){
                onlinesum = num;
                if(roomName!=''){
                    socket.broadcast.in(roomName).emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
                }else{
                    socket.broadcast.emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
                }
            });
        });

        /*用户发送消息*/
        socket.on('createMessage',function(data){
            if(black){
                return
            }else{
                var data2 = {
                    openid:userData.openid, token:userData.token, cid: roomName, uid: userData.uid,
                    nickName:userData.nickName,posterURL:userData.posterURL,tel:userData.tel,
                    openid: '',checked:0,voliate:0,createTime:moment().unix(),
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

function roomClientNum(nsp,room,callback){
    nsp.in(room).clients(function(error, clients){
        if (error) throw error;
        //console.log(clients,clients.length); // => [Anw2LatarvGVVXEIAAAD]
        callback(clients.length);
    });
}