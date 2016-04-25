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

router.route('/user/get').post(function(req,res){
    console.log('post-code',req.body.code);
    User.findById({code:req.body.code},function(err,user){
        if(user.length == 0){
            res.send({
                "code": 400,
                "msg": "fail"
            });
        }else{
            res.send({
                "code": 0,
                "msg": "success",
                "data": JSON.stringify(user[0])
            });
        }
    });
});

module.exports = router;
