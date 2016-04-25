/**
 * Created by yuan on 2016/4/19.
 */

var request = require('request');
var mysql = require('mysql');
var pool = mysql.createPool({
    host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
    user:'kankanewsapi',
    password:'kankanewsaws2016',
    database:'kk_danmaku'
});
var client = require("redis").createClient();

/*
var userOpt = {
    uri: 'http://ums.kankanews.com/t/getUserInfo.do',
    method: 'POST',
    body :'68',
    headers: {'Content-Type': 'text/xml'}
}
request(userOpt,function(err,res,body){
    console.log(body);
    if(parseInt(body.code) == 0){
        userInfo = JSON.parse(body.data);
        client.HMSET(data.code, userInfo);
        client.expire(data.code,3600);
    }else{
        console.log('用户不合法');
        //socket.disconnect();
        //return;
    }
});
*/

var data = {uid:'68'}

client.hgetall('kkUserBlack'+data.uid, function (err, obj) {
    if(obj){
        console.log('you',obj);
        //callback({code:110,msg:'黑名单用户'},null);
    }else {
        console.log('wu');
        pool.query('select * from kk_danmaku_violators where uid = ?',[data.uid],function(err,rows){
            if(err){
                console.log(err);
                //callback({code:110,msg:'黑名单用户'},null);
            }else{
                if(rows.length>0){
                    //var body = JSON.parse(rows[0]);
                    console.log(rows[0]);
                    rows[0].openid = 111;
                    client.HMSET('kkUserBlack'+data.uid, rows[0]);
                    client.expire(data.code,3600);
                }else{
                    var uid ='68',tel ='18521355675',nickName ='ss',posterURL ='http://q.qlogo.cn/qqapp/1103880827/A0C6E87820CBA8AFC1ECF3308337E0D0/100',createTime = new Date(),free = 1;
                    console.log('无此人',new Date());
                    pool.query('replace into kk_danmaku_violators(uid,tel,nickName,posterURL,createTime,free) values(?,?,?,?,?,?)',[uid,tel,nickName,posterURL,createTime,free],function(err,result){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(result);
                        }
                    });
                }
                //callback(null,rows);
            }
        });
    }
});