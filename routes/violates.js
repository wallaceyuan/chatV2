
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var config = require('../task/config');
var client  = config.client;
var pool  = config.pool;

router.get('/',function(req, res, next) {
    res.render('violates');
});

router.route('/token')
    .get(function(req, res,next) {
        var token = req.query.token;
        console.log(token);
        res.send();
        var BlackToken = 'kkUserBlack'+token;
        if(token == ''){
            res.send('传入有误');
            return
        }
        client.hgetall(token, function (err, obj) {
            if(obj){
                var data = obj.data;
                console.log('token', obj);
                var uid = JSON.parse(data).uid;

                client.DEL(BlackToken,function(err, obj){
                    if(obj){
                        console.log('BlackToken',obj);
                    }else{
                        console.log(err);
                    }
                })
                pool.query('delete from kk_danmaku_violators where uid = ? and free = 0',[uid],function(err,rows){
                    if(err){
                        res.send('删除失败');
                    }else{
                        res.send('删除成功');
                    }
                });
            }else {
                res.send('删除失败');
            }
        });
    })
    .post(function(req,res,next){
        logical(req,res);
    });

router.route('/tokenR')
    .post(function(req,res){
        logical(req,res);
    });


/*router.route('/tokenAll')
    .get(function(req, res,next) {
        client.keys('kkUserBlack*', function (err, obj) {
            if(err){
                console.log(err);
                res.send('err');
                return;
            }else{
                if(obj.length > 0){
                    for(var i = 0;i<obj.length;i++){

                        var token = obj[i].split('kkUserBlack')[1];
                        console.log('token',token);

                        console.log('i',obj[i]);
                        client.DEL(obj[i],function(err, obj){
                            if(obj){
                                console.log('BlackToken',obj);
                            }else{
                                console.log(err);
                            }
                        });
                        client.hgetall(token, function (err, obj) {
                            if(obj){
                                var data = obj.data;
                                var uid = JSON.parse(data).uid;
                                pool.query('delete from kk_danmaku_violators where uid = ? and free = 0',[uid],function(err,rows){
                                    if(err){
                                        message = '删除失败';
                                    }else{
                                        message = '删除成功';
                                    }
                                });
                            }else {
                                message = '没有这个token,已经删除';
                            }
                        });
                    }
                }
                res.send('ok');
            }
        });
    });*/


function logical(req,res){
    var telreceive = req.body.tel;
    console.log('telreceive',telreceive);
    client.keys('kkUserBlack*', function (err, obj) {
        if(err){
            res.send(err);
        }else{
            if(obj.length > 0){
                for(var i = 0;i<obj.length;i++){
                    var userBlackToken  = obj[i];
                    var token = obj[i].split('kkUserBlack')[1];
                    client.hgetall(token, function (err, result) {
                        if(err){
                            res.send(err);
                        }else{
                            if(result){
                                var tel = JSON.parse(result.data).tel;
                                console.log(tel);
                                if(tel == telreceive){
                                    client.DEL(userBlackToken,function(er, rs){
                                        if(obj){
                                            res.send({code:'删除成功'});
                                        }else{
                                            res.send(er);
                                        }
                                    });
                                }else{
                                    res.send({code:'没有这个token'});
                                }
                            }else {
                                res.send({code:'没有这个token'});
                            }
                        }
                    });
                }
            }else{
                res.send({code:'没有这个缓存'});
            }
        }
    });
}

module.exports = router;
