

/*var client = require("redis").createClient(6379, "knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");
var ip = 'http://54.222.215.248:80';*/

var client   = require("redis").createClient();
var ip = 'http://127.0.0.1:3000';

var mysql = require('mysql');
var pool = mysql.createPool({
    host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
    user:'kankanewsapi',
    password:'kankanewsaws2016',
    database:'kk_danmaku'
});

module.exports = {
    client:client,
    ip:ip,
    pool:pool
}
