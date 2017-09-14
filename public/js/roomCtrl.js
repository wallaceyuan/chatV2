angular.module('chatModule').controller('roomCtrl',function($rootScope,$scope,$timeout,socket,$location){
    $scope.status = false;$scope.dialog = false;$scope.ptop;
    $scope.world = [],$scope.times= [];
    $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
    $scope.chat = function(name){
        $scope.ptop = name;
    }

    $scope.messages = [],$scope.message = '',$scope.onlines = [];
    $scope.onlinesum = 0;

    var tone   = 'QsiGkK9sK2BDyCIXJgOizsiFx2d10quomV1KU2yRhvvtpWWNCk6RFEThclpNHAkblqd/AuS0O4eVWyFLi+DiIxT/Yvn5R62EdMz9KjzBfdlT68JSZJT0bR7ZXwiXXfTD0jTfuKdbMSzYKT73/+IKTsmq0rpt48mZng7U7/MfNrKON4K/llLub9UHC0eHDRRmJd4M8ySMIGpmRu0+hbf3A5UiXSTkjqFCa5GAzFHgAsV8W2ja8KV5rYTircty/ooIeKwAOujELtRjqt2HVnlH2I6ncZz5OSIMn5oA7DoiT1yeSWHotSyvI5vyLU9VvSz3baUO6ddinHgYEt6R6DyzcMKDYT9xCvydBKme35i5BQBi1xnxClr4/eVdIfSSGMc78SlhgZpBH8sZ1s4zuXhZJ9G0WkdFUoU5LLzgqOhRGFlxe56xfHQAs7PqBcZytQO8/suADUKoxrqKzXqicvn5MKRPZvSqRqw9h058JWUI3m7d7jJWxHB82kK9D13Uoaic4r2LBZzHfD0KanEIGx0P1GOKS7jDz5IsD5PkAQu2e3VP1k4wjSHdweeNSyzyrP+d3SLVlizLYeSIC8n//Z9oq338+q+G/X500UZWQHW9rRFMpTJ6SoVwbizoJNl4l04l15AYyNjA/pZNIoI5MRdawUA94ClhRAprF4BA3pQcsh8=';

    var ttwo   = 'rcc4XdLDliJW/13Tapw3YJHk1IsCg/0Mg+LctcjeER//xeC/9BNNoVH0lDzTKnPeopFJTj+MRcnAsKosUiHrRiAXH//KbnHUwDqn3AtGrhiNGWj2BuzGwklneeymtcd4RTmFBfYPW8JlGjG4CjCcU2iX8bcfAQuP3wQD/U41T9KlWh8y8MWjGSNsXrXwy/L9cAkXd4NOYrUSpKQs+xhIk4K4HlVRasYvBLzKxBruSra7SaFbDJhCVEf80jxlgQJW0wLlDCgLKHFbbBOClGhM45Pl5MTM028S19KEgjalI5tE3C4PF7r9L29KpHjtB56iccHvCzbX6F2qTxrmnzTmdkNB6+bySVyBXYe3AYhJVp7pCy21O8BomouBzfG1dPr22YHgRLa2mrgbQaU9DEyP9RQjCoOQGQrtDu7s3HNvydFnuBKN4Q8CNU4B51+LMEVpzYFHMHaQQXmBkd7/sQjaJmYoGXj2KG1o5pi3EQUPsmCPRzw2mYYHaql0QKS23cKfjrufQ08YVJh8UbgKp7YjO6M+dA27OPmlzTPPNWE1TGVA8LxMzRFjJDfyD7WJj6CxgCp5ZH3iMHD44HicqMqUPWmlKis9G/Ok1j/zAd6itKsi5bDjC/z/fNdBwsPOEi9lS54nqE1MWJ0QaU+DpUbLgV27v/Wk1yV7JFtS+Ow5CVg=';

    var tthree = "opV5fwXDlHdvHRdJGJ8WD2Am6z7lkyryo0BO8wJ0ViqVs+wUox3ppMQMb49dLI6tbwi24nML7DClJVNH2I53SsdRc7X0TxB33INM/Hzl1xrGXgcZbIgQo028WtgYwFlNf5RggnqJMvj/YtIzxLOr1CJ/iUw5b5df028QJ6TISVFJjKYItasMLsyitLIA9V1TP3vWawTdju1eKiu/8z6E6/SV8y9V6GN4BH4ObcG69o7LLD+yfpv/mXXNK17UeoqP4p/+4Cp++ZAxdW/2ZtMdbwOpPyxZu4Ux4cAm5ZTSQLJbWqpVbdKgrKfuMbeMWu8d8mw4MEe/HHCZeHzH/PHsf/5hU8ZbagTuxYSvqk3W0OJuyEpKhrbQDqP/gA7VrZXQujzUCMAXWT3JPYLs6D1hEdoPpNGsQKAxdqScAkLfGDbm9gzph7PjgdHOeojZf9+JlZWSkmG0Id15grtH2keH3T8HNVg7ywTIQRkq87lnvUqGrHCG2S3fKTLIgPxsvaC5JL/GPkvA3kPRqu5Xjj45RSUc7pPR+mOlAVujuRHnJqpQfxK1EZ0DdI88XjUaLFO7pIpyU8aADT17exnhLDXP1PVmD2a5WojV0nZ5Hv7DjSWPEvfcNI0+dxkd1po1AJCl+XNmdHOY1arbF1ol2sbKCbuxZS3530RjHbGuKitgA2E=";

    var tokenBox = [tone,ttwo,tthree];

    var namespace = $rootScope.param.namespace;

    var wxInfo = {
        "openid":"o81pDuLcFI2sNfOuLFYk9RlfSLWc",
        "nickname": "yyffww",
        "sex":"1",
        "province":"PROVINCE",
        "city":"CITY",
        "country":"COUNTRY",
        "headimgurl":"http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
        "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
    }

    var cooper = {
        type: 0, up: 0, down: 0,
        perform: {
            color: 'red', fontSize: '16px'
        },
        'id': 100,
        "posterURL": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46"
    }

    /*1 测试连接事件*/
    socket.on('connect', function(){

        socket.emit('user');

        if ($location.search().namespace) {
            $rootScope.namespace = $location.search().namespace;
        }
        if ($location.search().room) {
            var room = $location.search().room;
        }else{
            var room = $rootScope.param.room;
        }
        if ($location.search().index) {
            var index = $location.search().index;
        }else{
            var index = 0;
        }

        $scope.roomName = room;

        if(namespace == 'live'){
            socket.emit('userInit',{"room":room,"token":tokenBox[index]});
        }else if(namespace == 'wechat'){
            socket.emit('userInit',{"room":room,"openid":wxInfo.openid,'nickName':wxInfo.nickname,'posterURL':wxInfo.headimgurl});
        }else if(namespace == 'service'){
            socket.emit('userEnter',{"room":room});
        }
    });

    socket.on('userWebStatus',function(data){
        if(parseInt(data.status) == 0){
            console.log('userWebStatus',data);
            $scope.line = data.userData.nickName;
        }else{
            console.log('error',data);
        }
        $scope.onlines = data.users;
        $scope.onlinesum = data.onlinesum;
    });

    socket.on('userStatus',function(data){
        console.log('userStatus',data);
    });

    socket.on('historyData',function(msgs){
        var his = msgs.history;
        for (var k in his){
            if (his.hasOwnProperty(k)) {
                $scope.messageAdd( his[k]);
            }
        }
    });

    /*4.用户加入世界通知*/
    socket.on('joinChat',function(msg){
        console.log('joinChat',msg);
        var user = msg;
        $scope.onlinesum = msg.onlinesum;
        if(msg.id){
            $scope.ws = '';$scope.wss = '';
            $scope.world = {user:user.nickName,content:'上线了'};
            $scope.onlines.push(user);
            $timeout.cancel($scope.promise);
            var timer = $timeout(function() {
                $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
                $timeout.cancel(timer);
            }, 3000);
        }
    });

    socket.on('message.add',function(msg){
        console.log(msg)
        $scope.messageAdd(msg);
    });

    socket.on('message.error',function(msg){
        console.log('messageError',msg);
    });

    socket.on('people.del',function(msg){
        $scope.world = msg;$scope.onlinesum = msg.onlinesum;
        if(msg.user){
            $scope.ws = '';$scope.wss = '';
            $scope.onlines = $scope.onlines.filter(function(user){
                if(user)
                    return user.nickName != msg.user;
            });
            var timer = $timeout(function() {
                $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
                $timeout.cancel(timer);
            }, 3000);
        }

    });

    socket.on('disconnect',function(){
        //alert('disconnect');
    });

    $scope.createMessage = function(){
        var namespace = $rootScope.param.namespace;
        if(namespace == 'service') {
            if ($scope.message) {
                cooper.message = $scope.message
                cooper.name = Math.random().toString(36).substr(2)
                socket.emit('sendMessage', cooper);
                $scope.message = '';
            }
        }else{
            if ($scope.message) {
                socket.emit('createMessage', {
                    message: $scope.message,
                    type: 0, up: 0, down: 0,
                    perform: {
                        color: 'red', fontSize: '16px'
                    }
                });
                $scope.message = '';
            }
        }
    }

    /*回车事件*/
    $scope.enter = function(keyEvent){
        var char = keyEvent.charCode || keyEvent.keyCode || keyEvent.which;
        if(char == 13){
            $scope.createMessage();
        }
    }

    $scope.messageAdd = function(msg){
      if($.inArray(msg.time, $scope.times)>-1){
          msg.time = false;
      }else{
          $scope.times.push(msg.time);
      }
      if(msg.nickName == $scope.line){
          msg.flag = 'me message-reply';
      }else{
          msg.flag = 'other message-receive';
      }
      $scope.messages.push(msg);
      var timer = $timeout(function() {
          $('.content').mCustomScrollbar("scrollTo","bottom",{
              scrollInertia:100
          });
          $timeout.cancel(timer);
      }, 0);
    }
});

function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min
}
