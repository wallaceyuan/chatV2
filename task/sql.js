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

/*
pool.query('replace into kk_danmaku_message(cid,uid,openid,checked,voliate,createTime,up,down,type,perform,message) values(?,?,?,?,?,?,?,?,?,?,?)',[1,11,'',1,0,12345,'','','','',1],function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
});
*/


var client = require("redis").createClient(6379, "knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");

client.del('kkUserBlackLyNgmY7bk21bEWHAqZXKDsVdZaJd0p2/z+6qZI44YK3UYi0XNEKWNZMOGu7skNTQBDLj0Vd9lDKy25LuOJ3OiMSNknjHw+vKP/KLmuBIYx+MMjmKBdqIn3/BIKAuShO91iGFPp68xMjAHTaNO8APaKSfZfBdYoaQaP7+CsJDQeLMdUwCTKIItLGwMQVfw4HcmL8kir2g5g9+BB0Qg5HiBacnIUBcKetsdq913PoQdekFyMKWLYwLVTFeFA/JOBLGndIbpL/TZjH9aJbgGf0qKPVhlizKoX23BlVfUSS+I6g+s8cOuy86pc/idYHUbf7X9XnUmwDFJ7e2H7OreNxcAO4isQsx4EhVwEBA2XZ+9ERSspT7tB9h2RjPXqX8UUfsQOhyJYdRmu5+70fDLmdRykY7+PutkIomcm2rzDAyfQ2DMcLisSLUknNl0/Xi/mSWTgqngMuleyhIa48R6XXZ2JWtJePAIJOtk0uumajDKqsZwwosBDRXkE1usnqU38sOL5L3AAtXu4EZrIpNtZITVZ1rZdmyHIRtBR3tRSmm1dKW5M6g0EXcJAm3REWQbHq+Ovx1d6zjGCrZCTjyI1HpBS3pc9UDfox+v+Fx/Lff6K79fqHBuAhm0UwMNDLebN6g6NnTrkbN0zzMyeO4o4s+FsFSUmE36Ls0J/iK1hRHEyI=', function (err, obj) {
    if(obj){
        console.log(obj);
    }else {
        console.log(err);
    }
});
