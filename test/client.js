//client.js

var io = require('socket.io-client');
var cronJob = require('cron').CronJob;
var socket = io.connect('http://localhost:4000', {reconnect: true});
var debug = require('debug')('socket-client:main');

// Add a connect listener
socket.on('connect', function(socket) {
    console.log('Connected!');
});


var job = new cronJob('*/5 * * * * *',function(){
    socket.emit('CH01', 'me', 'test msg');
    socket.on('disconnect', function(){});
/* //创建一个子进程
 var child = spawn(process.execPath,['../task/client2.js']);
 //把子进程的标准输出的数据传递到主进程 的标准输出
 child.stdout.pipe(process.stdout);
 //把子进程的错误输出的数据传递到主进程的错误输出
 child.stderr.pipe(process.stderr);*/
});
job.start();
