var redis = require('redis');
var request = require('request');
var async = require('async');
var debug = require('debug')('socketfunc:save');
var moment = require('moment');
var _ = require('lodash')

var config = require('../task/config');
var asy = require('../task/asyncTask.js');
var timeWrong = '10s内发过言了'
var checkTime = 10

var onlinesum = 0;
var users = [];//在线users
var clients = [];//在线socket
var client  = config.client;//redis 服务器


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
        var key = '';//在线人数key 没用的在线用户功能
        var keyRoom = '';//房间人数key 没用的在线用户功能

        socket.on('userInit',function(data){//监听 客户端的消息
            console.log('socketid-----------------------'+socket.id);
            console.log('token-----------------------'+data.token);
            console.log('openid-----------------------'+data.openid);
            console.log('nsp-------------------------'+nsp.name);
            console.log('room------------------------'+data.room);

            if(nsp == null || data.room == null){
                socket.emit('message.error',{status: 705, msg: "参数传入错误1"});
                return;
            }
            key = keyPrim+NSP+data.room;
            keyRoom = 'RoomPeopleDetail'+NSP+data.room;

            /*计算当前room在线人数 没用的在线用户功能*/
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

            /*加入命名空间下的房间*/
            if(data.room!=''){
                socket.join(data.room);
            }

            /*async 验证用户身份*/
            async.waterfall([
                function(done){//用code查询是否被禁言(redis)
                    console.log('-------------svolidate-------------');
                    asy.Violator(done,data);
                },
                function(arg,done){//用code检测时候是allow用户（redis/sso）返回用户信息
                    console.log('sallow');
                    asy.Allowed(arg,done,data);
                },
            ],function(err,res){
                if(err){
                    console.log('-------------',err,'-------------');
                    client.get(key, function(error, val){
                        if(parseInt(val) < 1){
                            client.set(key, 0);
                            onlinesum = 0;
                        }else{
                            onlinesum = parseInt(val);
                        }
                        black = true,roomName = data.room,clients[socket.id] = socket;

                        socket.emit('userWebStatus',{status:err.code,msg:err.msg,users:users,onlinesum:onlinesum});

                        socket.emit('userStatus',{status:err.code,msg:err.msg});

                        /*拿取历史10条*/
                        asy.historyData(NSP+roomName,socket);
                    });
                }else{
                    black = false;var uif;/*将数组封装成用户信息*/
                    var openid,token;
                    try{
                        uif = JSON.parse(res.data);
                    }catch(e){
                        socket.emit('userStatus',{status: 705, msg: "参数传入错误2"});
                        return;
                    }
                    roomName = data.room, userName = uif.nickName,clients[socket.id] = socket;
                    if(data.openid){
                        openid = data.openid,token = '';
                    }else{
                        openid = '',token = data.token;
                    }

                    /*判断重复用户 没用的在线用户功能*/
                    var judge = users.filter(function(user){
                        if(user){
                            if(parseInt(uif.uid) == 1){
                                return roomName == user.room && uif.openid == user.openid;
                            }else{
                                return roomName == user.room && uif.uid == user.uid;
                            }
                        }
                    });

                    client.incr(key, function(error, val){
                        //----没用的用户在线人数功能start----
                        onlinesum = val;
                        userData = {"token":token,"openid":openid,"id": socket.id,"room":roomName,"posterURL":uif.posterURL,
                            "tel":uif.tel,"uid":uif.uid,"nickName":userName,"onlinesum":onlinesum};
                        if(data.token){
                            users = users.filter(function (user) {
                                return user.uid != uif.uid
                            });
                        }else{
                            users = users.filter(function (user) {
                                return user.openid != openid
                            });
                        }

                        users.push(userData);

                        var uifD = openid?openid:uif.uid;

                        if(judge.length == 0){
                            userCode = uifD;
                            if(roomName!=''){
                                socket.broadcast.in(roomName).emit('joinChat',userData);
                            }else{
                                socket.broadcast.emit('joinChat',userData);
                            }
                        }else{
                            userCode = uifD+'time'+moment().unix();
                            if(roomName!=''){
                                socket.broadcast.in(roomName).emit('joinChat',{onlinesum:val});
                            }else{
                                socket.broadcast.emit('joinChat',{onlinesum:val});
                            }
                        }

                        client.HMSET(keyRoom,userCode,JSON.stringify(userData),function(err, replies){
                            if(err){
                                console.log(err);
                            }else{
                                console.log(replies);
                            }
                        });
                        //----没用的用户在线人数功能end----

                        socket.emit('userStatus',{status:0,msg:'用户验证成功',userData:{nickName:userName,posterURL:uif.posterURL}});

                        //----没用的用户在线人数功能----
                        socket.emit('userWebStatus',{status:0,msg:'用户验证成功',userData:userData,users:users,onlinesum:onlinesum});

                        asy.historyData(NSP+roomName,socket);

                    });
                }
                console.log('-------------asy success-------------'/*,res*/);
                //debug('所有的任务完成了',res);
            });
        });

        /*service进入房间*/
        socket.on('userEnter',function (data) {
            roomName = data.room
            clients[socket.id] = socket;
            console.log('userEnter',roomName)
            if(roomName!=''){
                socket.join(roomName);
            }
        })

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

        /*接收redis发来的消息 service命名空间需求*/
        socket.on('seRedisCome',function (data) {
            var room = data.room
            console.log('-------------redisCome',data.message+'-------------');
            var delBox = ['socketid','cid','place','room']
            delBox.map((item)=>{
                delete data[item]
            })
            if(room!=''){
                //console.log('-------------redisCome',JSON.stringify(data)+'-------------');
                nsp.in(room).emit('message.add',data);
            }else{
                nsp.emit('message.add',data);
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

        /*接受用户发来的信息  service命名空间需求*/
        socket.on('sendMessage',data =>{
            try{
                var data2 = {socketid:socket.id,cid: roomName,createTime:moment().unix(), place:NSP+':'+roomName};
                data = _.assignIn(data,data2);
            }catch(e){
                console.log('client create message err');
                return;
            }
            data.message = String(data.message).trim();
            console.log(267,'socketid',data.socketid,'message',data.message);
            if(data.perform){
                try{
                    data.perform = JSON.stringify(data.perform);
                }catch(e){
                    data.perform = '';
                }
            }
            client.lpush('message',JSON.stringify(data),redis.print);
        })

        /*用户发送消息*/
        socket.on('createMessage',function(data){
/*            var sendTime = userData.sendTime
            console.log(281,moment().unix() ,sendTime)
            if(sendTime && moment().unix() - sendTime < checkTime){
                console.log(timeWrong)
                var errSocket = clients[userData.id];
                errSocket.emit('message.error',{status:707,msg:timeWrong});
                return
            }else{
                userData.sendTime = moment().unix()
            }*/
            if(black){
                return
            }else{
                try{
                    var data2 = {socketid:userData.id,cid: roomName, openid: '',checked:0,violate:0,createTime:moment().unix(), place:NSP+':'+roomName};
                    for(var item in userData){
                        data2[item]=userData[item];
                    }
                    for(var item in data2){
                        data[item]=data2[item];
                    }
                }catch(e){
                    console.log('client create message err');
                    return;
                }
                data.message = String(data.message).trim();
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
                    //console.log('userCode',userCode,replies);
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

                client.decr(key, function(error, val){
                    if(parseInt(val) < 1) client.set(key, 0);
                    onlinesum = val;
                    if(quweyFlag){
                        if(roomName!=''){
                            socket.broadcast.in(roomName).emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
                        }else{
                            socket.broadcast.emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
                        }
                    }else{
                        if(roomName!=''){
                            socket.broadcast.in(roomName).emit('people.del', {onlinesum:onlinesum});
                        }else{
                            socket.broadcast.emit('people.del', {onlinesum:onlinesum});
                        }
                    }
                });
            });
        });

        /*查询在线人数请求*/
        socket.on('onlineRequest',function(data){
            var key = data.key;
            client.get(key, function(error, val){
                if(parseInt(val) < 1){
                    client.set(key, 0);
                    onlinesum = 0;
                }else{
                    onlinesum = parseInt(val);
                }
            });
            socket.emit('giveOnline',{onlinesum:onlinesum});
        });

    });

}
