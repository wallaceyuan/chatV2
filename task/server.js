/**
 * Created by yuan on 2016/4/19.
 */
var http = require('http');

http.createServer(function (req, res) {
    res.end('helloworld   54.222.215.248');
}).listen(3000);