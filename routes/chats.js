var express = require('express');
var router = express.Router();
var User = require('../model/user');

router.get('/',function(req, res, next) {
    res.render('chat',{namespance:'',room:''});
});
router.get('/hall/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'hall',room:room});
});
router.get('/comment/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'comment',room:room});
});
router.get('/img/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'img',room:room});
});

router.get('/user/:code',function(req,res,next){
    var code = req.params.code;

    User.findById({code:code},function(err,user){
        res.send(user);
    });

})

module.exports = router;
