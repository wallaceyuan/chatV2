/**
 * Created by yuan on 2016/3/31.
 */
angular.module('chatModule').controller('roomCtrl',function($scope,$firebaseArray,socket){
    $scope.messages = [];
    $scope.status = true;
    $scope.line = {};
    var base = new Firebase('https://sizzling-heat-3542.firebaseio.com/yuanChat');
    //得到了一个可以操作数据库的对象
    var bookBase = $firebaseArray(base);
    $scope.onlines = bookBase;
    $scope.message = '';
    $scope.msg = {user: "系统", content: "请输入用户名"}
    $scope.createMessage = function(){
        if($scope.message){
            socket.send($scope.message);
            bookBase.$add($scope.message);
            $scope.message = '';
        }
    }
    $scope.subName = function(){
        $scope.status = false;
        if($scope.line){
            socket.send($scope.line);
            bookBase.$add($scope.line);
            $scope.line = '';
        }
    }
    $scope.replay = function(user){
        $scope.message = '@'+user;
    }
    $scope.enter = function(keyEvent){
        var char = keyEvent.charCode || keyEvent.keyCode || keyEvent.which;
        if(char == 13){
            $scope.createMessage();
        }
    }
    socket.on('connect', function(){
        $scope.tip = 'Hello,Friend!';
    });
    //监听服务器发过来的消息
    socket.on('message',function(msg){
        if(msg.type == 1){
            //$scope.onlines = msg.all;
        }else{
            $scope.messages.push(msg);
        }
    });
});
