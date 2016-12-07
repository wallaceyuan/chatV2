/**
 * Created by yuan on 2016/4/19.
 */

var request = require('request');
var mysql = require('mysql');
var moment = require('moment');
var emoji = require('emoji');

var token = 'FOggzNQPHlA0s5asJgG1jDNlfEGmsPMSaiPUrWdo1jvKok1MYdB1i692M93b5/UcdYn/Ceo0xpiWshQqo7aSGcUgatNpvg/lh62ERKQr8PWVsDPM3ihkpvL5b93EySXsrCM8/8Y3PZWvVf/Y90OhQFEuOIwkoBPPEzVYzMcRT8WOUEmovzSIikiw95AMyIMXGwVlLImPWF/g8CmALRdZcqkNtw3q7rDfhSLszuov7/GtZB7CFCVcbUDGSzqBt7qm/XHBrW8OzdThkF+LVNg8oagmA9ZfankiGN9uHlg6SltDRmE3OzABRPTQv13xf8YhmHomxBMMIWHcx3IlBzhEf8aev0UnP68jfnn5yC6rXszTdfiA/tn0lTsbHQ98+larnJvHmQUiIqxyvy6Aqca7RypcIaE9eMw7psn6dTpNxcWOebRbqDJ5tDZ5HNVSSFms7qpCVt3gAPCvX5YbAeUdyUD0285gG/Vab5LAkBZDHK6p5z8lAkcTxm85yzMuy1B8Ac1b9n0bKRW8pAF6T68LSIX0mqPGmlGT4EquFQDPTj9W+hLyBwKmwv3znZ+JHPMbkrw4Xvqs6pFlv5yekChsutvYx92NUylzXSMGi0TM6mxznfF5td+tMGgoCLfrvYioquDD/JPRMD6XgsKDcNuzn9p5I3/JZV6kI0TA1oMnzTY='


var codeOpt = {
    uri: 'http://ums.kankanews.com/t/tokenValidate.do',
    method: 'POST',
    body : token,
    headers: {'Content-Type': 'text/xml'}
};

request(codeOpt,function(err,res,body) {
    console.log(body)
});

/*
var client = require("redis").createClient();

var sss = '   21212      dsdsds             ';
var aasss = String(sss).trim();

console.log(aasss);*/
/*client.keys('*', function (err, obj) {
    if(err){
        console.log(err);
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                console.log(obj[i]);
            }
        }
    }
});*/
/*client.HMGET('KKDanMaKuRoomKey','KKDanMaKuOnlineUserlive144', function(error, val){
    if(error){
        console.log(error);
    }else{
        console.log(val);
    }
});

client.HINCRBY('KKDanMaKuRoomKey','KKDanMaKuOnlineUserlive144', 1, function(error, val){
    if(error){
        console.log(error);
    }else{
        console.log(val);
    }
});*/
/*client.keys('KKDanMaKuOnlineUser*', function (err, obj) {
    if(err){
        console.log(err);
        res.send('err');
        return;
    }else{
        console.log(obj);
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                console.log(obj[i]);
                client.DEL(obj[i],function(err,val){
                    console.log(val);
                });
            }
        }
    }
});*/
/*
console.log('12222😘121212', emoji.unifiedToText('12222😘12222'));
var aaa = emoji.unifiedToHTML('😘');
console.log(aaa);
*/

/*var buffer = new Buffer(1);
buffer[0] = 16;
buffer[1] = 4;
console.log(buffer);*/
/*var buffer = new Buffer('😘','utf8');
console.log(buffer);

console.log(123,buffer.toString('utf8',3,6));*/


/*
function _convertStringToUnicodeCodePoints(str) {
    var surrogate1st = 0,
        unicodeCodes = [],
        i = 0,
        l = str.length;

    for (; i < l; i++) {
        var utf16Code = str.charCodeAt(i);
        if (surrogate1st != 0) {
            if (utf16Code >= 0xDC00 && utf16Code <= 0xDFFF) {
                var surrogate2nd = utf16Code,
                    unicodeCode = (surrogate1st - 0xD800) * (1 << 10) + (1 << 16) + (surrogate2nd - 0xDC00);
                unicodeCodes.push(unicodeCode);
            }
            surrogate1st = 0;
        } else if (utf16Code >= 0xD800 && utf16Code <= 0xDBFF) {
            surrogate1st = utf16Code;
        } else {
            unicodeCodes.push(utf16Code);
        }
    }
    return unicodeCodes;
}

function _escapeToUtf32(str) {
    var escaped = [],
        unicodeCodes = _convertStringToUnicodeCodePoints(str),
        i = 0,
        l = unicodeCodes.length,
        hex;

    for (; i < l; i++) {
        hex = unicodeCodes[i].toString(16);
        escaped.push('0000'.substr(hex.length) + hex);
    }
    return escaped.join('-');
}


var reg = /\ud83d\ude04|\ud83d\ude03|\ud83d\ude00|\ud83d\ude0a|\u263a\ufe0f|\ud83d\ude09|\ud83d\ude0d|\ud83d\ude18|\ud83d\ude1a|\ud83d\ude17|\ud83d\ude19|\ud83d\ude1c|\ud83d\ude1d|\ud83d\ude1b|\ud83d\ude33|\ud83d\ude01|\ud83d\ude14|\ud83d\ude0c|\ud83d\ude12|\ud83d\ude1e|\ud83d\ude23|\ud83d\ude22|\ud83d\ude02|\ud83d\ude2d|\ud83d\ude2a|\ud83d\ude25|\ud83d\ude30|\ud83d\ude05|\ud83d\ude13|\ud83d\ude29|\ud83d\ude2b|\ud83d\ude28|\ud83d\ude31|\ud83d\ude20|\ud83d\ude21|\ud83d\ude24|\ud83d\ude16|\ud83d\ude06|\ud83d\ude0b|\ud83d\ude37|\ud83d\ude0e|\ud83d\ude34|\ud83d\ude35|\ud83d\ude32|\ud83d\ude1f|\ud83d\ude26|\ud83d\ude27|\ud83d\ude08|\ud83d\udc7f|\ud83d\ude2e|\ud83d\ude2c|\ud83d\ude10|\ud83d\ude15|\ud83d\ude2f|\ud83d\ude36|\ud83d\ude07|\ud83d\ude0f|\ud83d\ude11|\ud83d\udc72|\ud83d\udc73|\ud83d\udc6e|\ud83d\udc77|\ud83d\udc82|\ud83d\udc76|\ud83d\udc66|\ud83d\udc67|\ud83d\udc68|\ud83d\udc69|\ud83d\udc74|\ud83d\udc75|\ud83d\udc71|\ud83d\udc7c|\ud83d\udc78|\ud83d\ude3a|\ud83d\ude38|\ud83d\ude3b|\ud83d\ude3d|\ud83d\ude3c|\ud83d\ude40|\ud83d\ude3f|\ud83d\ude39|\ud83d\ude3e|\ud83d\udc79|\ud83d\udc7a|\ud83d\ude48|\ud83d\ude49|\ud83d\ude4a|\ud83d\udc80|\ud83d\udc7d|\ud83d\udca9|\ud83d\udd25|\u2728|\ud83c\udf1f|\ud83d\udcab|\ud83d\udca5|\ud83d\udca2|\ud83d\udca6|\ud83d\udca7|\ud83d\udca4|\ud83d\udca8|\ud83d\udc42|\ud83d\udc40|\ud83d\udc43|\ud83d\udc45|\ud83d\udc44|\ud83d\udc4d|\ud83d\udc4e|\ud83d\udc4c|\ud83d\udc4a|\u270a|\u270c\ufe0f|\ud83d\udc4b|\u270b|\ud83d\udc50|\ud83d\udc46|\ud83d\udc47|\ud83d\udc49|\ud83d\udc48|\ud83d\ude4c|\ud83d\ude4f|\u261d\ufe0f|\ud83d\udc4f|\ud83d\udcaa|\ud83d\udeb6|\ud83c\udfc3|\ud83d\udc83|\ud83d\udc6b|\ud83d\udc6a|\ud83d\udc6c|\ud83d\udc6d|\ud83d\udc8f|\ud83d\udc91|\ud83d\udc6f|\ud83d\ude46|\ud83d\ude45|\ud83d\udc81|\ud83d\ude4b|\ud83d\udc86|\ud83d\udc87|\ud83d\udc85|\ud83d\udc70|\ud83d\ude4e|\ud83d\ude4d|\ud83d\ude47|\ud83c\udfa9|\ud83d\udc51|\ud83d\udc52|\ud83d\udc5f|\ud83d\udc5e|\ud83d\udc61|\ud83d\udc60|\ud83d\udc62|\ud83d\udc55|\ud83d\udc54|\ud83d\udc5a|\ud83d\udc57|\ud83c\udfbd|\ud83d\udc56|\ud83d\udc58|\ud83d\udc59|\ud83d\udcbc|\ud83d\udc5c|\ud83d\udc5d|\ud83d\udc5b|\ud83d\udc53|\ud83c\udf80|\ud83c\udf02|\ud83d\udc84|\ud83d\udc9b|\ud83d\udc99|\ud83d\udc9c|\ud83d\udc9a|\u2764\ufe0f|\ud83d\udc94|\ud83d\udc97|\ud83d\udc93|\ud83d\udc95|\ud83d\udc96|\ud83d\udc9e|\ud83d\udc98|\ud83d\udc8c|\ud83d\udc8b|\ud83d\udc8d|\ud83d\udc8e|\ud83d\udc64|\ud83d\udc65|\ud83d\udcac|\ud83d\udc63|\ud83d\udcad|\ud83d\udc36|\ud83d\udc3a|\ud83d\udc31|\ud83d\udc2d|\ud83d\udc39|\ud83d\udc30|\ud83d\udc38|\ud83d\udc2f|\ud83d\udc28|\ud83d\udc3b|\ud83d\udc37|\ud83d\udc3d|\ud83d\udc2e|\ud83d\udc17|\ud83d\udc35|\ud83d\udc12|\ud83d\udc34|\ud83d\udc11|\ud83d\udc18|\ud83d\udc3c|\ud83d\udc27|\ud83d\udc26|\ud83d\udc24|\ud83d\udc25|\ud83d\udc23|\ud83d\udc14|\ud83d\udc0d|\ud83d\udc22|\ud83d\udc1b|\ud83d\udc1d|\ud83d\udc1c|\ud83d\udc1e|\ud83d\udc0c|\ud83d\udc19|\ud83d\udc1a|\ud83d\udc20|\ud83d\udc1f|\ud83d\udc2c|\ud83d\udc33|\ud83d\udc0b|\ud83d\udc04|\ud83d\udc0f|\ud83d\udc00|\ud83d\udc03|\ud83d\udc05|\ud83d\udc07|\ud83d\udc09|\ud83d\udc0e|\ud83d\udc10|\ud83d\udc13|\ud83d\udc15|\ud83d\udc16|\ud83d\udc01|\ud83d\udc02|\ud83d\udc32|\ud83d\udc21|\ud83d\udc0a|\ud83d\udc2b|\ud83d\udc2a|\ud83d\udc06|\ud83d\udc08|\ud83d\udc29|\ud83d\udc3e|\ud83d\udc90|\ud83c\udf38|\ud83c\udf37|\ud83c\udf40|\ud83c\udf39|\ud83c\udf3b|\ud83c\udf3a|\ud83c\udf41|\ud83c\udf43|\ud83c\udf42|\ud83c\udf3f|\ud83c\udf3e|\ud83c\udf44|\ud83c\udf35|\ud83c\udf34|\ud83c\udf32|\ud83c\udf33|\ud83c\udf30|\ud83c\udf31|\ud83c\udf3c|\ud83c\udf10|\ud83c\udf1e|\ud83c\udf1d|\ud83c\udf1a|\ud83c\udf11|\ud83c\udf12|\ud83c\udf13|\ud83c\udf14|\ud83c\udf15|\ud83c\udf16|\ud83c\udf17|\ud83c\udf18|\ud83c\udf1c|\ud83c\udf1b|\ud83c\udf19|\ud83c\udf0d|\ud83c\udf0e|\ud83c\udf0f|\ud83c\udf0b|\ud83c\udf0c|\ud83c\udf20|\u2b50\ufe0f|\u2600\ufe0f|\u26c5\ufe0f|\u2601\ufe0f|\u26a1\ufe0f|\u2614\ufe0f|\u2744\ufe0f|\u26c4\ufe0f|\ud83c\udf00|\ud83c\udf01|\ud83c\udf08|\ud83c\udf0a|\ud83c\udf8d|\ud83d\udc9d|\ud83c\udf8e|\ud83c\udf92|\ud83c\udf93|\ud83c\udf8f|\ud83c\udf86|\ud83c\udf87|\ud83c\udf90|\ud83c\udf91|\ud83c\udf83|\ud83d\udc7b|\ud83c\udf85|\ud83c\udf84|\ud83c\udf81|\ud83c\udf8b|\ud83c\udf89|\ud83c\udf8a|\ud83c\udf88|\ud83c\udf8c|\ud83d\udd2e|\ud83c\udfa5|\ud83d\udcf7|\ud83d\udcf9|\ud83d\udcfc|\ud83d\udcbf|\ud83d\udcc0|\ud83d\udcbd|\ud83d\udcbe|\ud83d\udcbb|\ud83d\udcf1|\u260e\ufe0f|\ud83d\udcde|\ud83d\udcdf|\ud83d\udce0|\ud83d\udce1|\ud83d\udcfa|\ud83d\udcfb|\ud83d\udd0a|\ud83d\udd09|\ud83d\udd08|\ud83d\udd07|\ud83d\udd14|\ud83d\udd15|\ud83d\udce2|\ud83d\udce3|\u23f3|\u231b\ufe0f|\u23f0|\u231a\ufe0f|\ud83d\udd13|\ud83d\udd12|\ud83d\udd0f|\ud83d\udd10|\ud83d\udd11|\ud83d\udd0e|\ud83d\udca1|\ud83d\udd26|\ud83d\udd06|\ud83d\udd05|\ud83d\udd0c|\ud83d\udd0b|\ud83d\udd0d|\ud83d\udec1|\ud83d\udec0|\ud83d\udebf|\ud83d\udebd|\ud83d\udd27|\ud83d\udd29|\ud83d\udd28|\ud83d\udeaa|\ud83d\udeac|\ud83d\udca3|\ud83d\udd2b|\ud83d\udd2a|\ud83d\udc8a|\ud83d\udc89|\ud83d\udcb0|\ud83d\udcb4|\ud83d\udcb5|\ud83d\udcb7|\ud83d\udcb6|\ud83d\udcb3|\ud83d\udcb8|\ud83d\udcf2|\ud83d\udce7|\ud83d\udce5|\ud83d\udce4|\u2709\ufe0f|\ud83d\udce9|\ud83d\udce8|\ud83d\udcef|\ud83d\udceb|\ud83d\udcea|\ud83d\udcec|\ud83d\udced|\ud83d\udcee|\ud83d\udce6|\ud83d\udcdd|\ud83d\udcc4|\ud83d\udcc3|\ud83d\udcd1|\ud83d\udcca|\ud83d\udcc8|\ud83d\udcc9|\ud83d\udcdc|\ud83d\udccb|\ud83d\udcc5|\ud83d\udcc6|\ud83d\udcc7|\ud83d\udcc1|\ud83d\udcc2|\u2702\ufe0f|\ud83d\udccc|\ud83d\udcce|\u2712\ufe0f|\u270f\ufe0f|\ud83d\udccf|\ud83d\udcd0|\ud83d\udcd5|\ud83d\udcd7|\ud83d\udcd8|\ud83d\udcd9|\ud83d\udcd3|\ud83d\udcd4|\ud83d\udcd2|\ud83d\udcda|\ud83d\udcd6|\ud83d\udd16|\ud83d\udcdb|\ud83d\udd2c|\ud83d\udd2d|\ud83d\udcf0|\ud83c\udfa8|\ud83c\udfac|\ud83c\udfa4|\ud83c\udfa7|\ud83c\udfbc|\ud83c\udfb5|\ud83c\udfb6|\ud83c\udfb9|\ud83c\udfbb|\ud83c\udfba|\ud83c\udfb7|\ud83c\udfb8|\ud83d\udc7e|\ud83c\udfae|\ud83c\udccf|\ud83c\udfb4|\ud83c\udc04\ufe0f|\ud83c\udfb2|\ud83c\udfaf|\ud83c\udfc8|\ud83c\udfc0|\u26bd\ufe0f|\u26be\ufe0f|\ud83c\udfbe|\ud83c\udfb1|\ud83c\udfc9|\ud83c\udfb3|\u26f3\ufe0f|\ud83d\udeb5|\ud83d\udeb4|\ud83c\udfc1|\ud83c\udfc7|\ud83c\udfc6|\ud83c\udfbf|\ud83c\udfc2|\ud83c\udfca|\ud83c\udfc4|\ud83c\udfa3|\u2615\ufe0f|\ud83c\udf75|\ud83c\udf76|\ud83c\udf7c|\ud83c\udf7a|\ud83c\udf7b|\ud83c\udf78|\ud83c\udf79|\ud83c\udf77|\ud83c\udf74|\ud83c\udf55|\ud83c\udf54|\ud83c\udf5f|\ud83c\udf57|\ud83c\udf56|\ud83c\udf5d|\ud83c\udf5b|\ud83c\udf64|\ud83c\udf71|\ud83c\udf63|\ud83c\udf65|\ud83c\udf59|\ud83c\udf58|\ud83c\udf5a|\ud83c\udf5c|\ud83c\udf72|\ud83c\udf62|\ud83c\udf61|\ud83c\udf73|\ud83c\udf5e|\ud83c\udf69|\ud83c\udf6e|\ud83c\udf66|\ud83c\udf68|\ud83c\udf67|\ud83c\udf82|\ud83c\udf70|\ud83c\udf6a|\ud83c\udf6b|\ud83c\udf6c|\ud83c\udf6d|\ud83c\udf6f|\ud83c\udf4e|\ud83c\udf4f|\ud83c\udf4a|\ud83c\udf4b|\ud83c\udf52|\ud83c\udf47|\ud83c\udf49|\ud83c\udf53|\ud83c\udf51|\ud83c\udf48|\ud83c\udf4c|\ud83c\udf50|\ud83c\udf4d|\ud83c\udf60|\ud83c\udf46|\ud83c\udf45|\ud83c\udf3d|\ud83c\udfe0|\ud83c\udfe1|\ud83c\udfeb|\ud83c\udfe2|\ud83c\udfe3|\ud83c\udfe5|\ud83c\udfe6|\ud83c\udfea|\ud83c\udfe9|\ud83c\udfe8|\ud83d\udc92|\u26ea\ufe0f|\ud83c\udfec|\ud83c\udfe4|\ud83c\udf07|\ud83c\udf06|\ud83c\udfef|\ud83c\udff0|\u26fa\ufe0f|\ud83c\udfed|\ud83d\uddfc|\ud83d\uddfe|\ud83d\uddfb|\ud83c\udf04|\ud83c\udf05|\ud83c\udf03|\ud83d\uddfd|\ud83c\udf09|\ud83c\udfa0|\ud83c\udfa1|\u26f2\ufe0f|\ud83c\udfa2|\ud83d\udea2|\u26f5\ufe0f|\ud83d\udea4|\ud83d\udea3|\u2693\ufe0f|\ud83d\ude80|\u2708\ufe0f|\ud83d\udcba|\ud83d\ude81|\ud83d\ude82|\ud83d\ude8a|\ud83d\ude89|\ud83d\ude9e|\ud83d\ude86|\ud83d\ude84|\ud83d\ude85|\ud83d\ude88|\ud83d\ude87|\ud83d\ude9d|\ud83d\ude8b|\ud83d\ude83|\ud83d\ude8e|\ud83d\ude8c|\ud83d\ude8d|\ud83d\ude99|\ud83d\ude98|\ud83d\ude97|\ud83d\ude95|\ud83d\ude96|\ud83d\ude9b|\ud83d\ude9a|\ud83d\udea8|\ud83d\ude93|\ud83d\ude94|\ud83d\ude92|\ud83d\ude91|\ud83d\ude90|\ud83d\udeb2|\ud83d\udea1|\ud83d\ude9f|\ud83d\udea0|\ud83d\ude9c|\ud83d\udc88|\ud83d\ude8f|\ud83c\udfab|\ud83d\udea6|\ud83d\udea5|\u26a0\ufe0f|\ud83d\udea7|\ud83d\udd30|\u26fd\ufe0f|\ud83c\udfee|\ud83c\udfb0|\u2668\ufe0f|\ud83d\uddff|\ud83c\udfaa|\ud83c\udfad|\ud83d\udccd|\ud83d\udea9|\ud83c\uddef\ud83c\uddf5|\ud83c\uddf0\ud83c\uddf7|\ud83c\udde9\ud83c\uddea|\ud83c\udde8\ud83c\uddf3|\ud83c\uddfa\ud83c\uddf8|\ud83c\uddeb\ud83c\uddf7|\ud83c\uddea\ud83c\uddf8|\ud83c\uddee\ud83c\uddf9|\ud83c\uddf7\ud83c\uddfa|\ud83c\uddec\ud83c\udde7|\u0031\ufe0f\u20e3|\u0032\ufe0f\u20e3|\u0033\ufe0f\u20e3|\u0034\ufe0f\u20e3|\u0035\ufe0f\u20e3|\u0036\ufe0f\u20e3|\u0037\ufe0f\u20e3|\u0038\ufe0f\u20e3|\u0039\ufe0f\u20e3|\u0030\ufe0f\u20e3|\ud83d\udd1f|\ud83d\udd22|\u0023\ufe0f\u20e3|\ud83d\udd23|\u2b06\ufe0f|\u2b07\ufe0f|\u2b05\ufe0f|\u27a1\ufe0f|\ud83d\udd20|\ud83d\udd21|\ud83d\udd24|\u2197\ufe0f|\u2196\ufe0f|\u2198\ufe0f|\u2199\ufe0f|\u2194\ufe0f|\u2195\ufe0f|\ud83d\udd04|\u25c0\ufe0f|\u25b6\ufe0f|\ud83d\udd3c|\ud83d\udd3d|\u21a9\ufe0f|\u21aa\ufe0f|\u2139\ufe0f|\u23ea|\u23e9|\u23eb|\u23ec|\u2935\ufe0f|\u2934\ufe0f|\ud83c\udd97|\ud83d\udd00|\ud83d\udd01|\ud83d\udd02|\ud83c\udd95|\ud83c\udd99|\ud83c\udd92|\ud83c\udd93|\ud83c\udd96|\ud83d\udcf6|\ud83c\udfa6|\ud83c\ude01|\ud83c\ude2f\ufe0f|\ud83c\ude33|\ud83c\ude35|\ud83c\ude34|\ud83c\ude32|\ud83c\ude50|\ud83c\ude39|\ud83c\ude3a|\ud83c\ude36|\ud83c\ude1a\ufe0f|\ud83d\udebb|\ud83d\udeb9|\ud83d\udeba|\ud83d\udebc|\ud83d\udebe|\ud83d\udeb0|\ud83d\udeae|\ud83c\udd7f\ufe0f|\u267f\ufe0f|\ud83d\udead|\ud83c\ude37|\ud83c\ude38|\ud83c\ude02|\u24c2\ufe0f|\ud83d\udec2|\ud83d\udec4|\ud83d\udec5|\ud83d\udec3|\ud83c\ude51|\u3299\ufe0f|\u3297\ufe0f|\ud83c\udd91|\ud83c\udd98|\ud83c\udd94|\ud83d\udeab|\ud83d\udd1e|\ud83d\udcf5|\ud83d\udeaf|\ud83d\udeb1|\ud83d\udeb3|\ud83d\udeb7|\ud83d\udeb8|\u26d4\ufe0f|\u2733\ufe0f|\u2747\ufe0f|\u274e|\u2705|\u2734\ufe0f|\ud83d\udc9f|\ud83c\udd9a|\ud83d\udcf3|\ud83d\udcf4|\ud83c\udd70|\ud83c\udd71|\ud83c\udd8e|\ud83c\udd7e|\ud83d\udca0|\u27bf|\u267b\ufe0f|\u2648\ufe0f|\u2649\ufe0f|\u264a\ufe0f|\u264b\ufe0f|\u264c\ufe0f|\u264d\ufe0f|\u264e\ufe0f|\u264f\ufe0f|\u2650\ufe0f|\u2651\ufe0f|\u2652\ufe0f|\u2653\ufe0f|\u26ce|\ud83d\udd2f|\ud83c\udfe7|\ud83d\udcb9|\ud83d\udcb2|\ud83d\udcb1|\u00a9|\u00ae|\u2122|\u274c|\u203c\ufe0f|\u2049\ufe0f|\u2757\ufe0f|\u2753|\u2755|\u2754|\u2b55\ufe0f|\ud83d\udd1d|\ud83d\udd1a|\ud83d\udd19|\ud83d\udd1b|\ud83d\udd1c|\ud83d\udd03|\ud83d\udd5b|\ud83d\udd67|\ud83d\udd50|\ud83d\udd5c|\ud83d\udd51|\ud83d\udd5d|\ud83d\udd52|\ud83d\udd5e|\ud83d\udd53|\ud83d\udd5f|\ud83d\udd54|\ud83d\udd60|\ud83d\udd55|\ud83d\udd56|\ud83d\udd57|\ud83d\udd58|\ud83d\udd59|\ud83d\udd5a|\ud83d\udd61|\ud83d\udd62|\ud83d\udd63|\ud83d\udd64|\ud83d\udd65|\ud83d\udd66|\u2716\ufe0f|\u2795|\u2796|\u2797|\u2660\ufe0f|\u2665\ufe0f|\u2663\ufe0f|\u2666\ufe0f|\ud83d\udcae|\ud83d\udcaf|\u2714\ufe0f|\u2611\ufe0f|\ud83d\uｎｏｔｉｎｌｉｂdd18|\ud83d\udd17|\u27b0|\u3030|\u303d\ufe0f|\ud83d\udd31|\u25fc\ufe0f|\u25fb\ufe0f|\u25fe\ufe0f|\u25fd\ufe0f|\u25aa\ufe0f|\u25ab\ufe0f|\ud83d\udd3a|\ud83d\udd32|\ud83d\udd33|\u26ab\ufe0f|\u26aa\ufe0f|\ud83d\udd34|\ud83d\udd35|\ud83d\udd3b|\u2b1c\ufe0f|\u2b1b\ufe0f|\ud83d\udd36|\ud83d\udd37|\ud83d\udd38|\ud83d\udd39/g;

var aa = '🍯🌭13456';
text = aa.replace(reg, function(code) {
    return _escapeToUtf32(code);
});
console.log(text);*/


/*var buf2 = new Buffer.from('😘', 'utf8');
console.log(buf2.toString());*/
/*var pool = mysql.createPool({
    host:'kankanewsapi.cjspd4t43dgd.rds.cn-north-1.amazonaws.com.cn',
    user:'kankanewsapi',
    password:'kankanewsaws2016',
    database:'kk_danmaku'
});*/
var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin',
    database:'kk_danmaku',
    connectTimeout:30000
});

/*var key = '3832time1463020538';

if(!key.match(/time/)){
    console.log('wu');
}else{
    console.log('you',key.match(/time/));
}*/







/*var qw = '3832time1463032126';
console.log(qw.match(/3832/));*/

/*var userData = {
    "token": "oeaNrRAtC5MDV7XdB4W0NJGb6UmDgUZXp19wKC8wZr2kPevqFyR6g//TFCE31bcIdbxJHE/1bPoOMkHWdf76cksf8K6JcAPweEjHMdeVVAn9WRuB0XWZj9hCc9DxccE+oyDGX6fXh4KNQttziiOS6V262mZ5RE+0FlPWtU8a9LMNhWnpOlbZb4fGS0n0bg3LoUX+DIAVYgb9MLOB5syZVHl/eqz8BP1+BzYMA9NAoLNR4K8PwLfz6oJDtPDXCLi3BLiQGWGkz4ZeR1YWHGsHva5OTHKVgb/IeNtFfw+Tm4lyJB4tU0CP2yX7C847Ebp1HjT3mMQM7Ywi16WxENiQCBu8NDqE9yUzHNh60NHdUZ8RZLzYuh2IHgWuR2RtHLiGmsOu+X3o5ECuEIn/wJvF00M3xNoswmkrVoil9WqkfGpDInjsCzQLJLo5iDYCv6qjvWhgz79S1Zpjlr/VZ6WkUe8lHRILDKZimzJI3Tptm6Um0ZPDIksReI9QJSXEo4JHyjRldyrUNdMwIWRzXq4tOpUnASQE3+E6Hv1CHW+Zd+8t9NQ7SBjOtuRVMAkkiNUq6AshXAjv9CZwmMQXmQ5sbXdnmihPY4uq8ZGzTTCZL4A1rROeVq84Vu2RZlvjj6rzqHCmKGD/inocJwPVFT5XIOMzAl3N4K8cMXdABHzslVg=",
    "opneid": "",
    "id": "/live#vHKMiZ2ZSKXoreX6AAAW",
    "room": "1",
    "posterURL": "http://q.qlogo.cn/qqapp/1103880827/A0C6E87820CBA8AFC1ECF3308337E0D0/100",
    "tel": "13671697034",
    "uid": "3832",
    "nickName": "移动手机号",
    "onlinesum": 2
}*/




/*
client.multi().HMSET('RoomPeopleDetaillive1',3832,JSON.stringify(userData)).expire('RoomPeopleDetaillive1',10).exec(function(err, replies){
    if(err){
        console.log(err);
    }else{
        console.log(replies);
    }
});
*/

/*
var html = '123   121212  1212';
var aaa = String(html).replace(/\s/g,"");
console.log(aaa);
*/


/*
client.DEL('1212',function(err, obj){
    if(obj){
        console.log('BlackToken',obj);
    }else{
        console.log(err);
    }
});*/

/*
var text = preg_replace_callback("/(\\\u[ed][0-9a-f]{3})/i",function($str){
    return addslashes($str[0]);
},text);
*/
/*var aaa = "\ue122";
var s1 = 1212121+aaa+11111111;

var s2 = s1.replace(/^\\u0000-\\uFFFF/, '');

console.log(s2);*/



/*
pool.query('select id from kk_danmaku_chatrooms where infoid = ?',[144],function(err,rows){
    if(err){
        console.log(err);
        callback();
    }else{
        console.log(rows);
        console.log('id',rows[0].id);
*/
/*        pool.query('replace into kk_danmaku_message(cid,uid,openid,checked,violate,createTime,up,down,type,perform,message) values(?,?,?,?,?,?,?,?,?,?,?)',[data.cid,data.uid,data.openid,0,data.violate,data.createTime,data.up,data.down,data.type,data.perform,data.message+data.nickName],function(err,result){
            if(err){
                console.log(err);
                callback();
            }else{
                console.log('insert success');
                callback();
            }
        });*//*

    }
});
*/
/*
var client = require("redis").createClient();
*/


/*client.HMSET('kkUserroom112', {111:1111121212121},function(err, replies){
    console.log("MULTI got " + replies.length + " replies");
})
client.HMSET('kkUserroom112', {22222:12222211121222222222221},function (err, replies) {
    console.log("MULTI got " + replies.length + " replies");
});*/
/*client.HDEL('kkUserroom112',111,function(err, replies){
    console.log("MULTI got " + replies.length + " replies");
});*/

/*
var users = [];
client.HGETALL('kkUserroom112',function(err, obj){
    if(err){
        console.log(err);
    }else{
        for(var key in obj){
            console.log(key+"--"+obj[key]);
            users.push(obj[key]);
        }
    }
    console.log(users);
});
*/


/*
client.llen('live1uers', function(error, count){
    if(error){
        console.log(error);
    }else{
        if(count){
            console.log(count);
        }
    }
});
*/




/*var BlackToken = 'kkUserBlackLyNgmY7bk21bEWHAqZXKDsVdZaJd0p2/z+6qZI44YK3UYi0XNEKWNZMOGu7skNTQBDLj0Vd9lDKy25LuOJ3OiMSNknjHw+vKP/KLmuBIYx+MMjmKBdqIn3/BIKAuShO91iGFPp68xMjAHTaNO8APaKSfZfBdYoaQaP7+CsJDQeLMdUwCTKIItLGwMQVfw4HcmL8kir2g5g9+BB0Qg5HiBacnIUBcKetsdq913PoQdekFyMKWLYwLVTFeFA/JOBLGndIbpL/TZjH9aJbgGf0qKPVhlizKoX23BlVfUSS+I6g+s8cOuy86pc/idYHUbf7X9XnUmwDFJ7e2H7OreNxcAO4isQsx4EhVwEBA2XZ+9ERSspT7tB9h2RjPXqX8UUfsQOhyJYdRmu5+70fDLmdRykY7+PutkIomcm2rzDAyfQ2DMcLisSLUknNl0/Xi/mSWTgqngMuleyhIa48R6XXZ2JWtJePAIJOtk0uumajDKqsZwwosBDRXkE1usnqU38sOL5L3AAtXu4EZrIpNtZITVZ1rZdmyHIRtBR3tRSmm1dKW5M6g0EXcJAm3REWQbHq+Ovx1d6zjGCrZCTjyI1HpBS3pc9UDfox+v+Fx/Lff6K79fqHBuAhm0UwMNDLebN6g6NnTrkbN0zzMyeO4o4s+FsFSUmE36Ls0J/iK1hRHEyI=';
var re = 'kkUserBlack';
/!*
var nameList = BlackToken.split(re);
var token = nameList[1];
client.hgetall(token, function (err, obj) {
    if(obj){
        var data = obj.data;
        var uid = JSON.parse(data).uid;

        client.DEL(BlackToken,function(err, obj){
            if(obj){
                console.log(obj);
            }else{
                console.log(err);
            }
        })

        pool.query('delete from kk_danmaku_violators where uid = ? and free = 0',[uid],function(err,rows){
            if(err){
                console.log(err);
            }else{
                console.log(rows);
            }
        });
        console.log(obj);
    }else {
        console.log(err);
    }
});
*!/
client.keys('kkUserBlack*', function (err, obj) {
    if(err){
        console.log(err);
    }else{
        if(obj.length > 0){
            for(var i = 0;i<obj.length;i++){
                console.log(obj[i]);
                var token = obj[i].split('kkUserBlack')[1];
                console.log(token);
            }
        }
    }
});*/

//console.log(new Date().getTime());
/*process.nextTick(function(){
    console.log('nextTick');
});
setTimeout(function(){
    console.log(111);
},0);
var x="",i= 0,j=0;
while (i<1000)
{
    i++;
    console.log(i);
}
while (j<1000)
{
    j++;
    console.log('second',j);
}
console.log(111222);*/
//new Date().getTime();

/*node 时间戳*/
/*var unix_time = moment().unix();
console.log(unix_time);//例如：1423721820
var tmp_time = moment.unix(unix_time).format("YYYY-MM-DD hh:mm:ss a");
console.log(tmp_time);//2015-02-12 02:16:02 pm*/

/*xxs防止sql注入*/
/*var xss = require('xss');
var html = xss('<div>1212</div>');
console.log(html);*/


/*去除sql特殊字符*/
/*re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
if (re.test('update')) {//特殊字符和SQL关键字
    console.log('存在特殊字符');
    //callback({code:703,msg:'存在特殊字符'},null);
}else{
    console.log('ok');
    //var message = xss(message);
    //callback(null,message);
}*/


/*敏感词库post*/
/*var codeOpt = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    url: 'http://kankanews.cn-north-1.eb.amazonaws.com.cn/KKShielder',
    method: 'POST',
    body:"words=1111"
};
request(codeOpt,function(err,res,body){
    var body = JSON.parse(body);
    console.log(body.size,body);
});*/


/*redis 记录黑名单*/
/*
var code = 'BK8eDVWVCjPRLZmdtLhIq7gMBxo4cHLJ/2JevlLADdJdanuiQWHCDL5NZ7Gx4P8ixxS6PJDW0jzcgpW20TXUbobEw0BRKW3DdgqMdaWLtEmgvENx1GkJtMM3+HkoPpo86D3li4mSb6wZ1+Srf+FxYzxpFGT29ugFnuobU2ZZK9KbM0IISxVY6/GSTNpRt9OMug2S8hy79VEW0aCUqgbMmmAAqXYEl7Q/2I47jjKDm6H1jtRxITom67Ifrf0mmB4zvrzERgUlE7Ql6Jp1QoTvoMj658rrY9UCjzfA9a4zpBo0+PFcAwzKVW7j4Xj7kae8zUp2xxri1hEj9Vrmd1bWmJxtbN1co8NZacNOxW4z7KpZxypgVQK1voLOwHqurv0VSwlN3iE3S1d/0HrJ8mnDI0A25/qy6ZG7sq3wJaiu4vrtwYA/vqrmSlA9FiDvO14gp1pJPKkxTQcWRUbLQZrcBbI/erfBgPBSZugt+8E1AKV+ivTBQ2gZ+cHLi36Q8BykrPy2bR75EpxGgNe9h4GErfBu+zb/V4BP8i7dYXyI3BGFz0BWo+pfG2idV5CHRzDCRPOVto4YSyMw5HuqWsWXXiIqmX/wt1zp2/wqYWXmoZ+36CyA0k1TjqgJqWPzasnhfTnoi4JQibU37ne3cXNWTEHu4Ucg8jGfnxl2vbZfh6Y=';
client.multi().HMSET('kkUserBlack'+code, {free:1}).expire('kkUserBlack'+code,3600).exec(function (err, replies) {
    console.log("kkUserBlack set");
});
*/


/*增加chatrooms*/
/*
var time = Date.parse(new Date())/1000;
pool.query('replace into kk_danmaku_chatrooms(open,createTime,type,infoid,title,intro) values(?,?,?,?,?,?)',[1,time,4,5,'wechat1','wechat1'],function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
});
*/


/*查询开放房间*/
/*pool.query('select t1.id from kk_danmaku_chatrooms as t1,kk_danmaku_namespace as t2 where t2.id = t1.type and namespace = ? and  t1.id = ? and open = ? ',['wechat',5,1],function(err,rows){
    if(err){
        console.log(err);
    }else{
        if(rows.length>0){
            console.log(rows[0]);
        }else{
            console.log('没有对应开放的房间');
        }
    }
});*/


/*用户token验证*/
/*
var userOpt = {
    uri: 'http://ums.kankanews.com/t/getUserInfo.do',
    method: 'POST',
    body :'68',
    headers: {'Content-Type': 'text/xml'}
}
request(userOpt,function(err,res,body){
    console.log(body);
    if(parseInt(body.code) == 0){
        userInfo = JSON.parse(body.data);
        client.HMSET(data.code, userInfo);
        client.expire(data.code,3600);
    }else{
        console.log('用户不合法');
        //socket.disconnect();
        //return;
    }
});
*/


/*var data = {uid:'68'}
client.hgetall('kkUserBlack'+data.uid, function (err, obj) {
    if(obj){
        console.log('you',obj);
        //callback({code:110,msg:'黑名单用户'},null);
    }else {
        console.log('wu');
        pool.query('select * from kk_danmaku_violators where uid = ?',[data.uid],function(err,rows){
            if(err){
                console.log(err);
                //callback({code:110,msg:'黑名单用户'},null);
            }else{
                if(rows.length>0){
                    //var body = JSON.parse(rows[0]);
                    console.log(rows[0]);
                    rows[0].openid = 111;
                    client.HMSET('kkUserBlack'+data.uid, rows[0]);
                    client.expire(data.code,3600);
                }else{
                    var uid ='68',tel ='18521355675',nickName ='ss',posterURL ='http://q.qlogo.cn/qqapp/1103880827/A0C6E87820CBA8AFC1ECF3308337E0D0/100',createTime = new Date(),free = 1;
                    console.log('无此人',new Date());
                    pool.query('replace into kk_danmaku_violators(uid,tel,nickName,posterURL,createTime,free) values(?,?,?,?,?,?)',[uid,tel,nickName,posterURL,createTime,free],function(err,result){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(result);
                        }
                    });
                }
                //callback(null,rows);
            }
        });
    }
});*/

/*console.log(Date.parse(new Date())/1000);
var data = { user: 'KzxGa', message: 'sss', time: '11:5' };*/
/*
var data2 = { cid: 'aa', uid: '12', openid: '',checked:0,voliate:0,createTime:Date.parse(new Date())/1000,type:'',perform:'',place:'' };

for(var item in data2){
    data[item]=data2[item];
}
console.log(data);*/