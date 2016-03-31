var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var signedCookieParser = cookieParser('yuanchat');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var port = process.env.PORT | 30;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'yuanchat',//secret 用来防止篡改 cookie
    resave: false,
    saveUninitialized: true
}));


app.use(function(req,res,next){
    username = res.locals.user = req.session.user;
    next();
});
app.use('/', routes);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//先创建一个HTTP服务器
var server = app.listen(port);
var io = require('socket.io').listen(server);
var messages = [];
var clients = [];

io.on('connection',function(socket){
    var username;
    //socket.send({user:'系统',content:'请输入用户名'});
    //监听 客户端的消息
    socket.on('message',function(msg){
        console.log(clients);
        var result = msg.match(/^@(.+)\s(.+)$/);
        if(result){
            var toUser = result[1];
            var content = result[2];
            if(clients[toUser]){//通过用户名把对应的socket取出来
                clients[toUser].send({user:username,content:'[私聊]'+content});
            }else{
                socket.send({user:'系统',content:'你想私聊的人不在线'});
            }
        }else{
            if(username){
                //把客户端发过来的消息广播给所有的客户端
                for(var s in clients){
                    clients[s].send({type:2,user:username,content:msg});
                }
            }else{
                username = msg;
                clients[username] = socket;
                for(var s in clients){
                    clients[s].send({type:1,user:username,content:msg});
                }
            }
        }
    })
    socket.on('disconnect', function () {
        //给别人增加一条消息
        console.log('disconnect',username);
        for(var s in clients){
            clients[s].send({type:3,user:username});
        }
    });
});


module.exports = app;
