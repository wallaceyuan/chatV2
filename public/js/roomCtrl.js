/**
 * Created by yuan on 2016/3/31.
 */
angular.module('chatModule').controller('roomCtrl',function($scope,socket){
    $scope.messages = [];
    $scope.status = true;
    $scope.line = '';
    $scope.onlines = [];
    $scope.message = '';
    $scope.msg = {user: "系统", content: "请输入用户名"}

    $scope.createMessage = function(){
        if($scope.message){
            socket.emit('createMessage',{user:$scope.line,message:$scope.message});
            $scope.message = '';
        }
    }

    $scope.subName = function(){
        console.log('subName');
        $scope.status = false;
        if($scope.line){
            socket.emit('join',$scope.line);
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
    socket.emit('getAllMessages');

    socket.on('allMessages',function(data){
        //$scope.messages = data.messages;
        $scope.onlines = data.users;
    });
    socket.on('message.add',function(msg){
        if(msg.user == $scope.line){
            msg.flag = 'me';
        }else{
            msg.flag = 'other';
        }
        $scope.messages.push(msg);
    });
    socket.on('joinChat',function(msg){
        console.log('joinChat');
        $scope.onlines = msg.users;
    });

    socket.on('message',function(msg){
        console.log(msg.type);
        if(msg.type == 'enter'){
        }else if(msg.type =='msg'){
            $scope.messages.push(msg);
        }else if(msg.type == 3){
            var i = 0;
        }else{
            $scope.onlines.push(msg);
        }
    });
});
