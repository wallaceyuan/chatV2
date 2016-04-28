

var client = require("redis").createClient(6379, "knews-redis2.nrm01e.ng.0001.cnn1.cache.amazonaws.com.cn");
//ar client   = require("redis").createClient();
var ip = 'http://54.222.215.248';
//var ip = 'http://127.0.0.1:3000';

module.exports = {
    client:client,
    ip:ip
}


