/**
 * Created by Yuan on 2016/5/1.
 */
function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min+':'+sec
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

function sleep(mils) {
    var now = new Date;
    while (new Date - now <= mils);
}

function filterUser(){
    users = users.filter(function(user){
        if(user)
        return roomName == user.room;
    });
}


function checkRoomPeopleNum(){
    roomClientNum(nsp,roomName,function(num){
        onlinesum = num;
        if(roomName!=''){
        socket.broadcast.in(roomName).emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
        }else{
        socket.broadcast.emit('people.del', {id:socket.id,user:userName,content:'下线了',onlinesum:onlinesum});
        }
    });
}

function roomClientNum(nsp,room,callback){
    nsp.in(room).clients(function(error, clients){
        if (error) throw error;
        //console.log(clients,clients.length); // => [Anw2LatarvGVVXEIAAAD]
        callback(clients.length);
    });
}

function roomCheck(arg,done){/*检查用户是否在同一个命名空间下的房间内重复登录*/
    roomName = data.room;
    var mivar;
    try{
        mivar = JSON.parse(arg.data);
        user.userRoomIn({uid:mivar.uid,users:users,room:roomName},function(err,res){
            console.log('euserin',res);
            done(err,arg);
        });
    }catch(e){
        socket.emit('userStatus',{status: 705, msg: "参数传入错误"});
        return;
    }
}

function hashTime(){
    client.HGETALL(keyRoom,function(err, obj){
        if(err){
            console.log(err);
        }else{
            if(obj){
                var userBox = [];
                for(var key in obj){
                    var objUser = JSON.parse(obj[key]);
                    console.log(objUser.id,objUser.expire);
                    if(moment().unix() - objUser.expire > 10){
                        client.HDEL(keyRoom,objUser.id,function(err, replies){
                            if(err){
                                console.log(err);
                            }else{
                                console.log(replies);
                            }
                        });
                    }else{
                        userBox.push(JSON.parse(obj[key]));
                    }
                }
                users = userBox;
            }
        }
    });
}