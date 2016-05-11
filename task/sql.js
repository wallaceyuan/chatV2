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


client.keys('kkUserBlack*', function (err, obj) {
    if(err){
        console.log(err);
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                var spp = obj[i];
                var token = obj[i].split('kkUserBlack')[1];
                client.hgetall(token, function (err, result) {
                    if(err){
                        console.log(err);
                    }else{
                        if(result){
                            console.log(spp);
                            console.log('--------------------------------------');
                            console.log(result);
                            console.log('--------------------------------------');
                        }
                    }
                });
            }
        }
    }
});
/*pool.query('select * from kk_danmaku_violators where uid = ? ',[3832],function(err,rows){
    if(err){
        console.log(err);
    }else{
        console.log(rows);
    }
});*/

/*
client.keys('kkUserBlackrcc4XdLDliJW/13Tapw3YJHk1IsCg/0Mg+LctcjeER//xeC/9BNNoVH0lDzTKnPeopFJTj+MRcnAsKosUiHrRiAXH//KbnHUwDqn3AtGrhiNGWj2BuzGwklneeymtcd4RTmFBfYPW8JlGjG4CjCcU2iX8bcfAQuP3wQD/U41T9KlWh8y8MWjGSNsXrXwy/L9cAkXd4NOYrUSpKQs+xhIk4K4HlVRasYvBLzKxBruSra7SaFbDJhCVEf80jxlgQJW0wLlDCgLKHFbbBOClGhM45Pl5MTM028S19KEgjalI5tE3C4PF7r9L29KpHjtB56iccHvCzbX6F2qTxrmnzTmdkNB6+bySVyBXYe3AYhJVp7pCy21O8BomouBzfG1dPr22YHgRLa2mrgbQaU9DEyP9RQjCoOQGQrtDu7s3HNvydFnuBKN4Q8CNU4B51+LMEVpzYFHMHaQQXmBkd7/sQjaJmYoGXj2KG1o5pi3EQUPsmCPRzw2mYYHaql0QKS23cKfjrufQ08YVJh8UbgKp7YjO6M+dA27OPmlzTPPNWE1TGVA8LxMzRFjJDfyD7WJj6CxgCp5ZH3iMHD44HicqMqUPWmlKis9G/Ok1j/zAd6itKsi5bDjC/z/fNdBwsPOEi9lS54nqE1MWJ0QaU+DpUbLgV27v/Wk1yV7JFtS+Ow5CVg=', function (err, obj) {
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


