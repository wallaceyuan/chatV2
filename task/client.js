//client.js
var io = require('socket.io-client');
var socket = io.connect('http://localhost:4000', {reconnect: true});
var debug = require('debug')('crawl:main');

// Add a connect listener
socket.on('connect', function(socket) {
    console.log('Connected!');
});

socket.emit('CH01', 'me', 'test msg');

socket.on('disconnect', function(){});
