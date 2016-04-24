var express = require('express');
var router = express.Router();

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

module.exports = router;
