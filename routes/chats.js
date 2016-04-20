var app = require('../app');

var http = require('http');
var express = require('express');
var router = express.Router();

/*router.get('/',function(req, res, next) {
    res.render('chat');
});*/
router.get('/a/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'a',room:room});
});
router.get('/b/:room',function(req, res, next) {
    res.render('chat');
});
router.get('/b/:room',function(req, res, next) {
    res.render('chat');
});
module.exports = router;
