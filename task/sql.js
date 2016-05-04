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
                console.log(obj[i]);
            }
        }
    }
});

/*
client.del('kkUserBlackLyNgmY7bk21bEWHAqZXKDsVdZaJd0p2/z+6qZI44YK3UYi0XNEKWNZMOGu7skNTQBDLj0Vd9lDKy25LuOJ3OiMSNknjHw+vKP/KLmuBIYx+MMjmKBdqIn3/BIKAuShO91iGFPp68xMjAHTaNO8APaKSfZfBdYoaQaP7+CsJDQeLMdUwCTKIItLGwMQVfw4HcmL8kir2g5g9+BB0Qg5HiBacnIUBcKetsdq913PoQdekFyMKWLYwLVTFeFA/JOBLGndIbpL/TZjH9aJbgGf0qKPVhlizKoX23BlVfUSS+I6g+s8cOuy86pc/idYHUbf7X9XnUmwDFJ7e2H7OreNxcAO4isQsx4EhVwEBA2XZ+9ERSspT7tB9h2RjPXqX8UUfsQOhyJYdRmu5+70fDLmdRykY7+PutkIomcm2rzDAyfQ2DMcLisSLUknNl0/Xi/mSWTgqngMuleyhIa48R6XXZ2JWtJePAIJOtk0uumajDKqsZwwosBDRXkE1usnqU38sOL5L3AAtXu4EZrIpNtZITVZ1rZdmyHIRtBR3tRSmm1dKW5M6g0EXcJAm3REWQbHq+Ovx1d6zjGCrZCTjyI1HpBS3pc9UDfox+v+Fx/Lff6K79fqHBuAhm0UwMNDLebN6g6NnTrkbN0zzMyeO4o4s+FsFSUmE36Ls0J/iK1hRHEyI=', function (err, obj) {
    if(obj){
        console.log(obj);
    }else {
        console.log(err);
    }
});




client.del('kkUserBlackopV5fwXDlHdvHRdJGJ8WD2Am6z7lkyryo0BO8wJ0ViqVs+wUox3ppMQMb49dLI6tbwi24nML7DClJVNH2I53SsdRc7X0TxB33INM/Hzl1xrGXgcZbIgQo028WtgYwFlNf5RggnqJMvj/YtIzxLOr1CJ/iUw5b5df028QJ6TISVFJjKYItasMLsyitLIA9V1TP3vWawTdju1eKiu/8z6E6/SV8y9V6GN4BH4ObcG69o7LLD+yfpv/mXXNK17UeoqP4p/+4Cp++ZAxdW/2ZtMdbwOpPyxZu4Ux4cAm5ZTSQLJbWqpVbdKgrKfuMbeMWu8d8mw4MEe/HHCZeHzH/PHsf/5hU8ZbagTuxYSvqk3W0OJuyEpKhrbQDqP/gA7VrZXQujzUCMAXWT3JPYLs6D1hEdoPpNGsQKAxdqScAkLfGDbm9gzph7PjgdHOeojZf9+JlZWSkmG0Id15grtH2keH3T8HNVg7ywTIQRkq87lnvUqGrHCG2S3fKTLIgPxsvaC5JL/GPkvA3kPRqu5Xjj45RSUc7pPR+mOlAVujuRHnJqpQfxK1EZ0DdI88XjUaLFO7pIpyU8aADT17exnhLDXP1PVmD2a5WojV0nZ5Hv7DjSWPEvfcNI0+dxkd1po1AJCl+XNmdHOY1arbF1ol2sbKCbuxZS3530RjHbGuKitgA2E=', function (err, obj) {
    if(obj){
        console.log(obj);
    }else {
        console.log(err);
    }
});
*/
