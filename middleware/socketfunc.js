var redis = require('redis');
var request = require('request');
var async = require('async');
var debug = require('debug')('socketfunc:save');
var moment = require('moment');
var domain = require('domain');
var user = require('../task/user');
var config = require('../task/config');

var onlinesum = 0;
var usersRedis = [];
var users = [];//在线users
var clients = [];//在线socket



var client  = config.client;

exports.socketHallFuc = function(nsp,client) {
    socketMain(nsp,client);
}

function socketMain(nsp,client){
    nsp.on('connection',function(socket){
        if(!nsp.name){
            return
        }
        var userCode;//userCode-key for redis room people
        var black = false,roomName = '',userData,userName,
            NSP = nsp.name == '/'?'root': nsp.name.replace(/\//g, "");
        var keyPrim     = "KKDanMaKuOnlineUser";
        var key = '';//在线人数key
        var keyRoom = '';//房间人数key

        socket.on('userInit',function(data){//监听 客户端的消息
            /*            console.log('token-----------------------'+data.token);
             console.log('nsp-------------------------'+nsp.name);
             console.log('room------------------------'+data.room);*/

            if(nsp == null || data.token == null || data.room == null){
                socket.emit('message.error',{status: 705, msg: "参数传入错误"});
                return;
            }
            key = keyPrim+NSP+data.room;
            keyRoom = 'RoomPeopleDetail'+NSP+data.room;

            client.get(key, function(error, val){
                if(parseInt(val) < 1){
                    client.set(key, 1);
                    onlinesum = 1;
                }else{
                    onlinesum = parseInt(val);
                }
            });

            client.HGETALL(keyRoom,function(err, obj){
                if(err){
                    console.log(err);
                }else{
                    if(obj){
                        var userBox = [];
                        for(var key in obj){
                            if(!key.match(/time/)){
                                userBox.push(JSON.parse(obj[key]));
                            }
                        }
                        users = userBox;
                    }else{
                        users = [];
                    }
                }
            });

            async.waterfall([
                function(done){//用code查询是否被禁言(redis)
                    console.log('-------------svolidate-------------');
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
            ],function(err,res){
                if(err){
                    console.log('-------------',err,'-------------');
                    black = true,roomName = data.room,clients[socket.id] = socket;
                    if(roomName!=''){
                        socket.join(roomName);
                    }
                    socket.emit('userWebStatus',{status:err.code,msg:err.msg,users:users,onlinesum:onlinesum});
                    socket.emit('userStatus',{status:err.code,msg:err.msg});
                }else{
                    black = false;var uif;/*将数组封装成用户信息*/
                    try{
                        uif = JSON.parse(res.data);
                    }catch(e){
                        socket.emit('userStatus',{status: 705, msg: "参数传入错误"});
                        return;
                    }
                    roomName = data.room, userName = uif.nickName,clients[socket.id] = socket;
                    if(data.openid){
                        var openid = data.openid,token = '';
                    }else{
                        var openid = '',token = data.token;
                    }
                    if(roomName!=''){
                        socket.join(roomName);
                    }

                    /*判断重复用户*/
                    var judge = users.filter(function(user){
                        if(user)
                            return roomName == user.room && uif.uid == user.uid;
                    });
                    if(judge.length > 0){
                        userCode = uif.uid+'time'+moment().unix();
                        /*                        users = users.filter(function(user){
                         if(user)
                         return roomName == user.room && uif.uid != user.uid;
                         });*/
                        userData = {token:token,opneid:openid,id: socket.id,room:roomName,posterURL:uif.posterURL,
                            tel:uif.tel,uid:uif.uid,nickName:userName,onlinesum:onlinesum};
                        emitUserInit(keyRoom,userData,userCode,userName,uif,socket);
                        return;
                    }else{
                        client.incr(key, function(error, val){
                            userCode = uif.uid;
                            onlinesum = val;
                            userData = {token:token,opneid:openid,id: socket.id,room:roomName,posterURL:uif.posterURL,
                                tel:uif.tel,uid:uif.uid,nickName:userName,onlinesum:onlinesum};
                            users.push(userData);
                            if(roomName!=''){
                                socket.broadcast.in(roomName).emit('joinChat',userData);
                            }else{
                                socket.broadcast.emit('joinChat',userData);
                            }
                            emitUserInit(keyRoom,userData,userCode,userName,uif,socket);
                        });
                    }
                }
                console.log('-------------asy success-------------'/*,res*/);
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
        socket.on('redisCome',function (data) {
            console.log('-------------redisCome',data.message);
            try{
                var msgInfo = {"message":data.message,"createTime":data.createTime,
                    "type":data.type,"up":data.up,
                    "down":data.down,"perform":data.perform,
                    "nickName":data.nickName,"posterURL":data.posterURL
                }
            }catch(e){
                var msgInfo = {};
            }
            if(data.room!=''){
                nsp.in(data.room).emit('message.add',msgInfo);
            }else{
                nsp.emit('message.add',msgInfo);
            }
        });

        /*接收redis错误信息返回*/
        socket.on('messageError',function(data){
            console.log('messageError',data,data.socketid);
            try{
                var errSocket = clients[data.socketid];
                var err = {status:data.status,msg:data.msg}
                console.log('-------------messageError-errSocket-------------',data.socketid);
                if(errSocket){
                    if(data.room!=''){
                        errSocket.emit('message.error',err);
                    }else{
                        errSocket.emit('message.error',err);
                    }
                }
            }catch(e){

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
                    openid: '',checked:0,violate:0,createTime:moment().unix(),socketid:userData.id,
                    place:NSP+':'+roomName
                };
                for(var item in data2){
                    data[item]=data2[item];
                }

                data.message = String(data.message).replace(/\s/g,"");
                console.log('socketid',data.socketid,'message',data.message);
                if(data.perform){
                    try{
                        data.perform = JSON.stringify(data.perform);
                    }catch(e){
                        data.perform = '';
                    }
                }
                client.lpush('message',JSON.stringify(data),redis.print);
            }
        });

        /*用户下线*/
        socket.on('disconnect', function () {

            var quweyFlag = true;

            if(!userData){
                return
            }
            client.HDEL(keyRoom,userCode,function(err, replies){
                if(err){
                    console.log(err);
                }else{
                    console.log('userCode',userCode,replies);
                }
            });

            if(socket.id)
                delete clients[socket.id];

            console.log('leave socket',socket.id);

            socket.leave(roomName);

            var queryLey = userCode.split('time')[0];

            client.HGETALL(keyRoom,function(err, obj){
                if(err){
                    console.log(err);
                }else{
                    if(obj){
                        for(var keypeople in obj){
                            if(keypeople.split('time')[0] == queryLey){
                                quweyFlag = false;
                            }
                        }
                    }
                }
                if(quweyFlag){
                    client.decr(key, function(error, val){
                        if(parseInt(val) < 1) client.set(key, 1);
                        onlinesum = val;
                        if(roomName!=''){
                            socket.broadcast.in(roomName).emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
                        }else{
                            socket.broadcast.emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
                        }
                    });
                }
            });
        });

    });

    function emitUserInit(keyRoom,userData,userCode,userName,uif,socket){
        client.HMSET(keyRoom,userCode,JSON.stringify(userData),function(err, replies){
            if(err){
                console.log(err);
            }else{
                console.log(replies);
            }
        });
        socket.emit('userStatus',{status:0,msg:'用户验证成功',userData:{nickName:userName,posterURL:uif.posterURL}});
        socket.emit('userWebStatus',{status:0,msg:'用户验证成功',userData:userData,users:users,onlinesum:onlinesum});
    }
}




