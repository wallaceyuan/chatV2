var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next) {
    res.render('chat',{namespance:'',room:''});
});
router.get('/chatroom/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'chatroom',room:room});
});
router.get('/live/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'live',room:room});
});
router.get('/vod/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'vod',room:room});
});
router.get('/wechat/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'wechat',room:room});
});
router.get('/broadcast/:room',function(req, res, next) {
    var room = req.params.room;
    res.render('chat',{namespance:'broadcast',room:room});
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

router.route('/message/valide').post(function(req,res){
    console.log('post-message',req.body.message);

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
