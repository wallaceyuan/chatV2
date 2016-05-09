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


/*client.keys('kkUserBlack*', function (err, obj) {
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
pool.query('select * from kk_danmaku_violators where uid = ? ',[3832],function(err,rows){
    if(err){
        console.log(err);
    }else{
        console.log(rows);
    }
});
/*
client.keys('kkUserBlackoeaNrRAtC5MDV7XdB4W0NJGb6UmDgUZXp19wKC8wZr2kPevqFyR6g//TFCE31bcIdbxJHE/1bPoOMkHWdf76cksf8K6JcAPweEjHMdeVVAn9WRuB0XWZj9hCc9DxccE+oyDGX6fXh4KNQttziiOS6V262mZ5RE+0FlPWtU8a9LMNhWnpOlbZb4fGS0n0bg3LoUX+DIAVYgb9MLOB5syZVHl/eqz8BP1+BzYMA9NAoLNR4K8PwLfz6oJDtPDXCLi3BLiQGWGkz4ZeR1YWHGsHva5OTHKVgb/IeNtFfw+Tm4lyJB4tU0CP2yX7C847Ebp1HjT3mMQM7Ywi16WxENiQCBu8NDqE9yUzHNh60NHdUZ8RZLzYuh2IHgWuR2RtHLiGmsOu+X3o5ECuEIn/wJvF00M3xNoswmkrVoil9WqkfGpDInjsCzQLJLo5iDYCv6qjvWhgz79S1Zpjlr/VZ6WkUe8lHRILDKZimzJI3Tptm6Um0ZPDIksReI9QJSXEo4JHyjRldyrUNdMwIWRzXq4tOpUnASQE3+E6Hv1CHW+Zd+8t9NQ7SBjOtuRVMAkkiNUq6AshXAjv9CZwmMQXmQ5sbXdnmihPY4uq8ZGzTTCZL4A1rROeVq84Vu2RZlvjj6rzqHCmKGD/inocJwPVFT5XIOMzAl3N4K8cMXdABHzslVg=', function (err, obj) {
    if(err){
        console.log(err);
        res.send('err');
        return;
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){

                var token = obj[i].split('kkUserBlack')[1];
                console.log('token',token);

                console.log('i',obj[i]);
                client.DEL(obj[i],function(err, obj){
                    if(obj){
                        console.log('BlackToken',obj);
                    }else{
                        console.log(err);
                    }
                });
                client.hgetall(token, function (err, obj) {
                    if(obj){
                        var data = obj.data;
                        var uid = JSON.parse(data).uid;
                        pool.query('delete from kk_danmaku_violators where uid = ? and free = 0',[uid],function(err,rows){
                            if(err){
                                message = '删除失败';
                            }else{
                                message = '删除成功';
                            }
                        });
                    }else {
                        message = '没有这个token,已经删除';
                    }
                });
            }
        }
    }
});
*/


