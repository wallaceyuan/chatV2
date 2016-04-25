var request = require('request');//拉取网页内容
//var iconv = require('iconv-lite');//把GBK转成UTF8
var mysql = require('mysql');
var pool = mysql.createPool({
    host:'120.27.5.9',
    user:'root',
    password:'admin',
    database:'chat'
});

var debug = require('debug')('sso:read');


exports.findById = function(item,callback){
    pool.query('select * from userInfo where code = ?',[item.code],function(err,rows){
        callback(err,rows);
    });
}

exports.sso = function(url,callback){
    request({url:url,encoding:null},function(err,res,body){
        if(err){
            return console.error(err);
        }
        //把gbk编码的buffer转成utf8编码的字符串
        body = iconv.decode(body,'gbk');
        //根据响应体转成DOM对象
        var items = [];
        //找到所有的分类的A标签并进行转换
        callback(null,items);
    });
}


exports.article = function(url,cid,callback){
    request({url:url,encoding:null},function(err,res,body){
        if(err){
            return console.error(err);
        }
        //把gbk编码的buffer转成utf8编码的字符串
        body = iconv.decode(body,'gbk');
        //根据响应体转成DOM对象
        var $ = cheerio.load(body);
        var items = [];
        //找到所有的分类的A标签并进行转换
        $('.keyword a').each(function(){
            var $me = $(this);
            var item = {
                name:$me.text().trim(),
                url:$me.attr('href'),
                cid:cid
            }
            if(item.name != 'search'){
                debug('读取文章',JSON.stringify(item));
                items.push(item);
            }
        });
        callback(null,items);
    });
}
