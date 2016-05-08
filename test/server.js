/**
 * Created by yuan on 2016/4/19.
 */

var request = require('request');
var mysql = require('mysql');
var moment = require('moment');

var client = require("redis").createClient();
/*var pool = mysql.createPool({
    host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
    user:'kankanewsapi',
    password:'kankanewsaws2016',
    database:'kk_danmaku'
});*/
var pool = mysql.createPool({
    host:'120.27.5.9',
    user:'root',
    password:'admin',
    database:'kk_danmaku',
    connectTimeout:3000
});

/*
var text = preg_replace_callback("/(\\\u[ed][0-9a-f]{3})/i",function($str){
    return addslashes($str[0]);
},text);
*/
var aaa = "\ue122";
var s1 = 1212121+aaa+11111111;

var s2 = s1.replace(/^\\u0000-\\uFFFF/, '');

console.log(s2);



/*
pool.query('select id from kk_danmaku_chatrooms where infoid = ?',[144],function(err,rows){
    if(err){
        console.log(err);
        callback();
    }else{
        console.log(rows);
        console.log('id',rows[0].id);
*/
/*        pool.query('replace into kk_danmaku_message(cid,uid,openid,checked,violate,createTime,up,down,type,perform,message) values(?,?,?,?,?,?,?,?,?,?,?)',[data.cid,data.uid,data.openid,0,data.violate,data.createTime,data.up,data.down,data.type,data.perform,data.message+data.nickName],function(err,result){
            if(err){
                console.log(err);
                callback();
            }else{
                console.log('insert success');
                callback();
            }
        });*//*

    }
});
*/
/*
var client = require("redis").createClient();
*/
/*var token = 'opV5fwXDlHdvHRdJGJ8WD2Am6z7lkyryo0BO8wJ0ViqVs+wUox3ppMQMb49dLI6tbwi24nML7DClJVNH2I53SsdRc7X0TxB33INM/Hzl1xrGXgcZbIgQo028WtgYwFlNf5RggnqJMvj/YtIzxLOr1CJ/iUw5b5df028QJ6TISVFJjKYItasMLsyitLIA9V1TP3vWawTdju1eKiu/8z6E6/SV8y9V6GN4BH4ObcG69o7LLD+yfpv/mXXNK17UeoqP4p/+4Cp++ZAxdW/2ZtMdbwOpPyxZu4Ux4cAm5ZTSQLJbWqpVbdKgrKfuMbeMWu8d8mw4MEe/HHCZeHzH/PHsf/5hU8ZbagTuxYSvqk3W0OJuyEpKhrbQDqP/gA7VrZXQujzUCMAXWT3JPYLs6D1hEdoPpNGsQKAxdqScAkLfGDbm9gzph7PjgdHOeojZf9+JlZWSkmG0Id15grtH2keH3T8HNVg7ywTIQRkq87lnvUqGrHCG2S3fKTLIgPxsvaC5JL/GPkvA3kPRqu5Xjj45RSUc7pPR+mOlAVujuRHnJqpQfxK1EZ0DdI88XjUaLFO7pIpyU8aADT17exnhLDXP1PVmD2a5WojV0nZ5Hv7DjSWPEvfcNI0+dxkd1po1AJCl+XNmdHOY1arbF1ol2sbKCbuxZS3530RjHbGuKitgA2E=';

client.multi().HMSET('kkUserBlac'+token, {free:0}).expire('kkUserBlack'+token,3600).exec(function (err, replies) {
    console.log("MULTI got " + replies.length + " replies");
});*/

/*var BlackToken = 'kkUserBlackLyNgmY7bk21bEWHAqZXKDsVdZaJd0p2/z+6qZI44YK3UYi0XNEKWNZMOGu7skNTQBDLj0Vd9lDKy25LuOJ3OiMSNknjHw+vKP/KLmuBIYx+MMjmKBdqIn3/BIKAuShO91iGFPp68xMjAHTaNO8APaKSfZfBdYoaQaP7+CsJDQeLMdUwCTKIItLGwMQVfw4HcmL8kir2g5g9+BB0Qg5HiBacnIUBcKetsdq913PoQdekFyMKWLYwLVTFeFA/JOBLGndIbpL/TZjH9aJbgGf0qKPVhlizKoX23BlVfUSS+I6g+s8cOuy86pc/idYHUbf7X9XnUmwDFJ7e2H7OreNxcAO4isQsx4EhVwEBA2XZ+9ERSspT7tB9h2RjPXqX8UUfsQOhyJYdRmu5+70fDLmdRykY7+PutkIomcm2rzDAyfQ2DMcLisSLUknNl0/Xi/mSWTgqngMuleyhIa48R6XXZ2JWtJePAIJOtk0uumajDKqsZwwosBDRXkE1usnqU38sOL5L3AAtXu4EZrIpNtZITVZ1rZdmyHIRtBR3tRSmm1dKW5M6g0EXcJAm3REWQbHq+Ovx1d6zjGCrZCTjyI1HpBS3pc9UDfox+v+Fx/Lff6K79fqHBuAhm0UwMNDLebN6g6NnTrkbN0zzMyeO4o4s+FsFSUmE36Ls0J/iK1hRHEyI=';
var re = 'kkUserBlack';
/!*
var nameList = BlackToken.split(re);
var token = nameList[1];
client.hgetall(token, function (err, obj) {
    if(obj){
        var data = obj.data;
        var uid = JSON.parse(data).uid;

        client.DEL(BlackToken,function(err, obj){
            if(obj){
                console.log(obj);
            }else{
                console.log(err);
            }
        })

        pool.query('delete from kk_danmaku_violators where uid = ? and free = 0',[uid],function(err,rows){
            if(err){
                console.log(err);
            }else{
                console.log(rows);
            }
        });
        console.log(obj);
    }else {
        console.log(err);
    }
});
*!/
client.keys('kkUserBlack*', function (err, obj) {
    if(err){
        console.log(err);
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                console.log(obj[i]);
                var token = obj[i].split('kkUserBlack')[1];
                console.log(token);
            }
        }
    }
});*/

//console.log(new Date().getTime());
/*process.nextTick(function(){
    console.log('nextTick');
});
setTimeout(function(){
    console.log(111);
},0);
var x="",i= 0,j=0;
while (i<1000)
{
    i++;
    console.log(i);
}
while (j<1000)
{
    j++;
    console.log('second',j);
}
console.log(111222);*/
//new Date().getTime();

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
/*re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
if (re.test('update')) {//特殊字符和SQL关键字
    console.log('存在特殊字符');
    //callback({code:703,msg:'存在特殊字符'},null);
}else{
    console.log('ok');
    //var message = xss(message);
    //callback(null,message);
}*/


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