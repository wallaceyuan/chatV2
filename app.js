var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('yuanchat:server');
var http = require('http');
var fs = require('fs');
//var port = normalizePort(process.env.PORT || '1000');
var port = normalizePort(process.argv[2] || '3000');

//路由
var routes = require('./routes/index');
var chats = require('./routes/chats');
var violates = require('./routes/violates');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/chats', chats);
app.use('/violates', violates);

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


app.set('port', port);

var server = http.createServer(app);

var socket = require('./middleware/socket');

socket.socketio(server);

server.listen(port);


server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

var config = require('./task/config');

var client = config.client;

if(port == 3000){

  client.keys('KKDanMaKuOnlineUser*', function (err, obj) {
      if(err){
          console.log(err);
          res.send('err');
          return;
      }else{
          if(obj.length > 0){
              for(var i = 0;i<obj.length;i++){
                  client.DEL(obj[i]);
              }
          }
      }
  });

  client.keys('RoomPeopleDetail*', function (err, obj) {
      if(err){
          console.log(err);
          res.send('err');
          return;
      }else{
          if(obj.length > 0){
              for(var i = 0;i<obj.length;i++){
                  client.DEL(obj[i]);
              }
          }
      }
  });
}