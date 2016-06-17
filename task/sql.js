/**
 * Created by yuan on 2016/4/28.
 */
var mysql = require('mysql');
var pool = mysql.createPool({
    host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
    user:'kankanewsapi',
    password:'kankanewsaws2016',
    database:'kk_danmaku',
    acquireTimeout: 30000 // 30s
});

var config = require('../task/config');
var client = config.client;

/*client.keys('*', function (err, obj) {
    if(err){
        console.log(err);
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                console.log(obj[i]);
            }
        }
    }
});*/



client.HGETALL('RoomPeopleDetaillive1',function(err, obj){
    if(err){
        console.log(err);
    }else{
        console.log(obj);
    }
});
client.LRANGE('messageKKDM1',0,10,function(err, obj){
    if(err){
        console.log(err);
    }else{
        console.log(obj);
    }
});