
angular.module('chatModule').controller('roomCtrl',function($rootScope,$scope,$timeout,socket,$location){
    $scope.status = false;$scope.dialog = false;$scope.ptop;
    $scope.world = [],$scope.times= [];
    $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
    $scope.chat = function(name){
        $scope.ptop = name;
    }

    $scope.messages = [],$scope.message = '',$scope.onlines = [];
    $scope.onlinesum = 0;

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

        var tone = 'opV5fwXDlHdvHRdJGJ8WD2Am6z7lkyryo0BO8wJ0ViqVs+wUox3ppMQMb49dLI6tbwi24nML7DClJVNH2I53SsdRc7X0TxB33INM/Hzl1xrGXgcZbIgQo028WtgYwFlNf5RggnqJMvj/YtIzxLOr1CJ/iUw5b5df028QJ6TISVFJjKYItasMLsyitLIA9V1TP3vWawTdju1eKiu/8z6E6/SV8y9V6GN4BH4ObcG69o7LLD+yfpv/mXXNK17UeoqP4p/+4Cp++ZAxdW/2ZtMdbwOpPyxZu4Ux4cAm5ZTSQLJbWqpVbdKgrKfuMbeMWu8d8mw4MEe/HHCZeHzH/PHsf/5hU8ZbagTuxYSvqk3W0OJuyEpKhrbQDqP/gA7VrZXQujzUCMAXWT3JPYLs6D1hEdoPpNGsQKAxdqScAkLfGDbm9gzph7PjgdHOeojZf9+JlZWSkmG0Id15grtH2keH3T8HNVg7ywTIQRkq87lnvUqGrHCG2S3fKTLIgPxsvaC5JL/GPkvA3kPRqu5Xjj45RSUc7pPR+mOlAVujuRHnJqpQfxK1EZ0DdI88XjUaLFO7pIpyU8aADT17exnhLDXP1PVmD2a5WojV0nZ5Hv7DjSWPEvfcNI0+dxkd1po1AJCl+XNmdHOY1arbF1ol2sbKCbuxZS3530RjHbGuKitgA2E=';

        var ttwo = 'LyNgmY7bk21bEWHAqZXKDsVdZaJd0p2/z+6qZI44YK3UYi0XNEKWNZMOGu7skNTQBDLj0Vd9lDKy25LuOJ3OiMSNknjHw+vKP/KLmuBIYx+MMjmKBdqIn3/BIKAuShO91iGFPp68xMjAHTaNO8APaKSfZfBdYoaQaP7+CsJDQeLMdUwCTKIItLGwMQVfw4HcmL8kir2g5g9+BB0Qg5HiBacnIUBcKetsdq913PoQdekFyMKWLYwLVTFeFA/JOBLGndIbpL/TZjH9aJbgGf0qKPVhlizKoX23BlVfUSS+I6g+s8cOuy86pc/idYHUbf7X9XnUmwDFJ7e2H7OreNxcAO4isQsx4EhVwEBA2XZ+9ERSspT7tB9h2RjPXqX8UUfsQOhyJYdRmu5+70fDLmdRykY7+PutkIomcm2rzDAyfQ2DMcLisSLUknNl0/Xi/mSWTgqngMuleyhIa48R6XXZ2JWtJePAIJOtk0uumajDKqsZwwosBDRXkE1usnqU38sOL5L3AAtXu4EZrIpNtZITVZ1rZdmyHIRtBR3tRSmm1dKW5M6g0EXcJAm3REWQbHq+Ovx1d6zjGCrZCTjyI1HpBS3pc9UDfox+v+Fx/Lff6K79fqHBuAhm0UwMNDLebN6g6NnTrkbN0zzMyeO4o4s+FsFSUmE36Ls0J/iK1hRHEyI=';

        var tokenBox = [tone,ttwo];

        $scope.roomName = room;

        socket.emit('userInit',{room:$scope.roomName,token:tokenBox[index]});
    });

    socket.on('userStatus',function(data){
        console.log(data);
        if(parseInt(data.status.code) == 0){
            $scope.line = data.userData.nickName;
        }
        $scope.onlines = data.users;
        $scope.onlinesum = data.onlinesum;
    });

    /*4.用户加入世界通知*/
    socket.on('joinChat',function(msg){
        console.log('joinChat',msg);
        var user = msg;
        $scope.ws = '';$scope.wss = '';
        $scope.world = {user:user.nickName,content:'上线了'};
        $scope.onlines.push(user);
        $scope.onlinesum = msg.onlinesum;

        $timeout.cancel($scope.promise);

        var timer = $timeout(function() {
            $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
            $timeout.cancel(timer);
        }, 3000);

    });

    socket.on('message.add',function(msg){
        console.log(msg);
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
    });

    socket.on('people.del',function(msg){
        $scope.ws = '';$scope.wss = '';
        $scope.world = msg;$scope.onlinesum = msg.onlinesum;
        $scope.onlines = $scope.onlines.filter(function(user){
            if(user)
                return user.id != msg.id;
        });

        var timer = $timeout(function() {
            $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
            $timeout.cancel(timer);
        }, 3000);
    });

    socket.on('disconnect',function(){
        //alert('disconnect');
    });


    $scope.createMessage = function(){
        if($scope.message){
            socket.emit('createMessage',{
                message:$scope.message,
                time:getTime(),
                type:'',up:0,down:0,
                perform:{
                    color:'red',fontSize:'16px'
                },
            });
            $scope.message = '';
        }
    }

    /*回车事件*/
    $scope.enter = function(keyEvent){
        var char = keyEvent.charCode || keyEvent.keyCode || keyEvent.which;
        if(char == 13){
            $scope.createMessage();
        }
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

