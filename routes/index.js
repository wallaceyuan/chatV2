var express = require('express');
var router = express.Router();
var middleware = require('../middleware/index');
var fs = require('fs');

/* GET home page. */
router.get('/',function(req, res, next) {
/*  console.log(__dirname +'/public/'+'user.json');
  fs.readFile(__dirname +'/public/'+'user.json',function(err,data){
    console.log(data);
    var data = JSON.parse(data);
    res.render('index', {onlines:data});
  });*/
  res.render('index');
});
//给路由先指定路径，再指定方法，还可以链式调用
router.route('/login').post(function (req, res) {
  req.session.user = req.body;
  res.send({code: 1, msg: '成功!'});
});
/*router.get('/#/room',function(req, res, next) {
  console.log('/#room');
  if(!req.session.user){
    res.redirect('/');
  }
});*/

/*router.post('/login',function(req, res, next) {
  var name = req.body.name;
  console.log(name);
  req.session.user = name;//用户信息存入 session
  console.log(req.session.user);
  res.redirect('/#room/');//注册成功后返回主页
});*/
module.exports = router;
