
angular.module('chatModule').controller('twoCtrl',function($scope,$timeout,socket){
    $scope.host = '',$scope.ptop = '';$scope.show = false;
    $scope.room = '';$scope.romsg = [];
    $scope.roomMessage = function(){
        if($scope.roomM){
            socket.emit('rMessage',{room:$scope.room,user:$scope.line,roomM:$scope.roomM});
            $scope.roomM = '';
        }
    }
    $scope.romenter = function(keyEvent){
        var char = keyEvent.charCode || keyEvent.keyCode || keyEvent.which;
        if(char == 13){
            $scope.roomMessage();
        }
    }

    socket.on('privte Message',function(data){
        console.log(data);
        if(data.ptop == $scope.line){
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

    $scope.$on('start',function(event,line,ptop){
        $scope.host = line,$scope.ptop = ptop;
        $scope.show = true;
        $scope.room = randomString(5);
        socket.emit('joinRoom',{room:$scope.room,ptop:ptop,host:line});
    });

    socket.on('initInto',function(data){
        if($scope.show){
            alert('对方占线中...请稍后');
            return
        }
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
