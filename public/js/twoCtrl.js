
angular.module('chatModule').controller('twoCtrl',function($scope,$timeout,socket){
    $scope.host = '',$scope.ptop = '';$scope.show = false;
    $scope.room = '';$scope.romsg = [];
    $scope.roomMessage = function(){
        if($scope.roomM){
            socket.emit('rMessage',{room:$scope.room,sender:$scope.line,roomM:$scope.roomM,time:getTime()});
            $scope.roomM = '';
        }
    }

    socket.on('privte Message',function(data){
        console.log(data);
        if(data.sender == $scope.line){
            data.flag = 'me room-reply';
        }else{
            data.flag = 'other room-receive';
        }
        $scope.romsg.push(data);
        var timer = $timeout(function() {
            $('.room').mCustomScrollbar("scrollTo","bottom",{
                scrollInertia:500
            });
            $timeout.cancel(timer);
        }, 0);
    });

    $scope.romenter = function(keyEvent){
        var char = keyEvent.charCode || keyEvent.keyCode || keyEvent.which;
        if(char == 13){
            $scope.roomMessage();
        }
    }

    $scope.$on('start',function(event,line,ptop){
        if($scope.show){
            alert('一次只能撩一个哦');
            return
        }
        $scope.room = randomString(5);
        socket.emit('joinRoom',{room:$scope.room,ptop:ptop,host:line});
    });

    socket.on('online',function(){
        alert('对方在线中...请稍后');
    });
    socket.on('gotochat',function(data){
        $scope.show = true;
        $scope.host = data.host,$scope.ptop = data.ptop;
    });

    socket.on('initInto',function(data){
        socket.emit('initInto',data.room);
        $scope.show = true;$scope.room = data.room;
        $scope.host = data.host,$scope.ptop = data.ptop;
    });


});

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
