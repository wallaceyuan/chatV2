
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var config = require('../task/config');
var client  = config.client;
var pool  = config.pool;

router.get('/',function(req, res, next) {
    res.send('OK');
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
    });


router.route('/tokenAll')
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
    });


module.exports = router;
