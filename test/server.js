/**
 * Created by yuan on 2016/4/19.
 */

var request = require('request');
var mysql = require('mysql');
var moment = require('moment');
var pool = mysql.createPool({
    host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
    user:'kankanewsapi',
    password:'kankanewsaws2016',
    database:'kk_danmaku'
});
var client = require("redis").createClient();

/*node 时间戳*/
/*var unix_time = moment().unix();
console.log(unix_time);//例如：1423721820
var tmp_time = moment.unix(unix_time).format("YYYY-MM-DD hh:mm:ss a");
console.log(tmp_time);//2015-02-12 02:16:02 pm*/


/*xxs防止sql注入*/
/*var xss = require('xss');
var html = xss('<div>1212</div>');
console.log(html);*/


/*去除sql特殊字符*/
re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
if (re.test('update')) {//特殊字符和SQL关键字
    console.log('存在特殊字符');
    //callback({code:703,msg:'存在特殊字符'},null);
}else{
    console.log('ok');
    //var message = xss(message);
    //callback(null,message);
}


/*敏感词库post*/
/*var codeOpt = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    url: 'http://kankanews.cn-north-1.eb.amazonaws.com.cn/KKShielder',
    method: 'POST',
    body:"words=1111"
};
request(codeOpt,function(err,res,body){
    var body = JSON.parse(body);
    console.log(body.size,body);
});*/



/*redis 记录黑名单*/
/*
var code = 'BK8eDVWVCjPRLZmdtLhIq7gMBxo4cHLJ/2JevlLADdJdanuiQWHCDL5NZ7Gx4P8ixxS6PJDW0jzcgpW20TXUbobEw0BRKW3DdgqMdaWLtEmgvENx1GkJtMM3+HkoPpo86D3li4mSb6wZ1+Srf+FxYzxpFGT29ugFnuobU2ZZK9KbM0IISxVY6/GSTNpRt9OMug2S8hy79VEW0aCUqgbMmmAAqXYEl7Q/2I47jjKDm6H1jtRxITom67Ifrf0mmB4zvrzERgUlE7Ql6Jp1QoTvoMj658rrY9UCjzfA9a4zpBo0+PFcAwzKVW7j4Xj7kae8zUp2xxri1hEj9Vrmd1bWmJxtbN1co8NZacNOxW4z7KpZxypgVQK1voLOwHqurv0VSwlN3iE3S1d/0HrJ8mnDI0A25/qy6ZG7sq3wJaiu4vrtwYA/vqrmSlA9FiDvO14gp1pJPKkxTQcWRUbLQZrcBbI/erfBgPBSZugt+8E1AKV+ivTBQ2gZ+cHLi36Q8BykrPy2bR75EpxGgNe9h4GErfBu+zb/V4BP8i7dYXyI3BGFz0BWo+pfG2idV5CHRzDCRPOVto4YSyMw5HuqWsWXXiIqmX/wt1zp2/wqYWXmoZ+36CyA0k1TjqgJqWPzasnhfTnoi4JQibU37ne3cXNWTEHu4Ucg8jGfnxl2vbZfh6Y=';
client.multi().HMSET('kkUserBlack'+code, {free:1}).expire('kkUserBlack'+code,3600).exec(function (err, replies) {
    console.log("kkUserBlack set");
});
*/



/*增加chatrooms*/
/*
var time = Date.parse(new Date())/1000;
pool.query('replace into kk_danmaku_chatrooms(open,createTime,type,infoid,title,intro) values(?,?,?,?,?,?)',[1,time,4,5,'wechat1','wechat1'],function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
});
*/


/*查询开放房间*/
/*pool.query('select t1.id from kk_danmaku_chatrooms as t1,kk_danmaku_namespace as t2 where t2.id = t1.type and namespace = ? and  t1.id = ? and open = ? ',['wechat',5,1],function(err,rows){
    if(err){
        console.log(err);
    }else{
        if(rows.length>0){
            console.log(rows[0]);
        }else{
            console.log('没有对应开放的房间');
        }
    }
});*/







/*用户token验证*/
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



/*var data = {uid:'68'}
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
});*/

/*console.log(Date.parse(new Date())/1000);
var data = { user: 'KzxGa', message: 'sss', time: '11:5' };*/
/*
var data2 = { cid: 'aa', uid: '12', openid: '',checked:0,voliate:0,createTime:Date.parse(new Date())/1000,type:'',perform:'',place:'' };

for(var item in data2){
    data[item]=data2[item];
}
console.log(data);*/