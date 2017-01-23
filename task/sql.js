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


var client = require("redis").createClient(6379, "knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");
/*client.keys('KKDanMaKuOnlineUser*', function (err, obj) {
    if(err){
        console.log(err);
        res.send('err');
        return;
    }else{
        console.log(obj);
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                console.log(obj[i]);
                client.DEL(obj[i],function(err,val){
                    console.log(val);
                });
            }
        }
    }
});*/
client.keys('*', function (err, obj) {
    if(err){
        console.log(err);
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                console.log(obj[i]);
            }
        }
    }
});



