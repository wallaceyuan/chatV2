var http = require('http');

http.createServer(function(req, res) {
    try {
        handler(req, res);
    } catch(e) {
        console.log('\r\n', e, '\r\n', e.stack);
        try {
            res.end(e.stack);
        } catch(e) { }
    }
}).listen(8080, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8080/');

var handler = function (req, res) {
    //Error Popuped
    var name = req.params.name;

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello ' + name);
};