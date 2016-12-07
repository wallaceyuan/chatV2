/**
 * Created by Yuan on 2016/5/26.
 */
var config = require('./config');
var client = config.client;
client.keys('KKDanMaKuOnlineUser*', function (err, obj) {
    if(err){
        console.log(err);
        res.send('err');
        return;
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                client.DEL(obj[i]);
            }
        }
    }
});

client.keys('RoomPeopleDetail*', function (err, obj) {
    if(err){
        console.log(err);
        res.send('err');
        return;
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                client.DEL(obj[i]);
            }
        }
    }
});