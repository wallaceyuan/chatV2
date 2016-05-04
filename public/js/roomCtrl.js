
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

        var tone   = 'opV5fwXDlHdvHRdJGJ8WD2Am6z7lkyryo0BO8wJ0ViqVs+wUox3ppMQMb49dLI6tbwi24nML7DClJVNH2I53SsdRc7X0TxB33INM/Hzl1xrGXgcZbIgQo028WtgYwFlNf5RggnqJMvj/YtIzxLOr1CJ/iUw5b5df028QJ6TISVFJjKYItasMLsyitLIA9V1TP3vWawTdju1eKiu/8z6E6/SV8y9V6GN4BH4ObcG69o7LLD+yfpv/mXXNK17UeoqP4p/+4Cp++ZAxdW/2ZtMdbwOpPyxZu4Ux4cAm5ZTSQLJbWqpVbdKgrKfuMbeMWu8d8mw4MEe/HHCZeHzH/PHsf/5hU8ZbagTuxYSvqk3W0OJuyEpKhrbQDqP/gA7VrZXQujzUCMAXWT3JPYLs6D1hEdoPpNGsQKAxdqScAkLfGDbm9gzph7PjgdHOeojZf9+JlZWSkmG0Id15grtH2keH3T8HNVg7ywTIQRkq87lnvUqGrHCG2S3fKTLIgPxsvaC5JL/GPkvA3kPRqu5Xjj45RSUc7pPR+mOlAVujuRHnJqpQfxK1EZ0DdI88XjUaLFO7pIpyU8aADT17exnhLDXP1PVmD2a5WojV0nZ5Hv7DjSWPEvfcNI0+dxkd1po1AJCl+XNmdHOY1arbF1ol2sbKCbuxZS3530RjHbGuKitgA2E=';
        var ttwo   = 'LyNgmY7bk21bEWHAqZXKDsVdZaJd0p2/z+6qZI44YK3UYi0XNEKWNZMOGu7skNTQBDLj0Vd9lDKy25LuOJ3OiMSNknjHw+vKP/KLmuBIYx+MMjmKBdqIn3/BIKAuShO91iGFPp68xMjAHTaNO8APaKSfZfBdYoaQaP7+CsJDQeLMdUwCTKIItLGwMQVfw4HcmL8kir2g5g9+BB0Qg5HiBacnIUBcKetsdq913PoQdekFyMKWLYwLVTFeFA/JOBLGndIbpL/TZjH9aJbgGf0qKPVhlizKoX23BlVfUSS+I6g+s8cOuy86pc/idYHUbf7X9XnUmwDFJ7e2H7OreNxcAO4isQsx4EhVwEBA2XZ+9ERSspT7tB9h2RjPXqX8UUfsQOhyJYdRmu5+70fDLmdRykY7+PutkIomcm2rzDAyfQ2DMcLisSLUknNl0/Xi/mSWTgqngMuleyhIa48R6XXZ2JWtJePAIJOtk0uumajDKqsZwwosBDRXkE1usnqU38sOL5L3AAtXu4EZrIpNtZITVZ1rZdmyHIRtBR3tRSmm1dKW5M6g0EXcJAm3REWQbHq+Ovx1d6zjGCrZCTjyI1HpBS3pc9UDfox+v+Fx/Lff6K79fqHBuAhm0UwMNDLebN6g6NnTrkbN0zzMyeO4o4s+FsFSUmE36Ls0J/iK1hRHEyI=';
        var tthree = 'V0PXBGjSHVu+8+OYWhPsK56EVjC6NkId1lj7m180dMAvo01FV7/wyndqYiiLmUuVdbq3tShS4f2LnMBZxRjm33PBm9UymnpCIn4B6mIDM1zD8ShKpyoWCKe+/Qho5XqYbs0C4YHxupqEDJTwsaWxF48uzv8s04tszGYxWkJ+O7sZ1nMea7U3YGhOLn9eZ115cV9zlLYLo23ieM+Rf7FR+YTFsRoV/DEQ1/50+COX+7ZZ48eWR8X2wKU/92e7mQKauFzZSWFljJHWfiG1RmdGVkzpilAjRd4c3/OTG5B0IRa/cojnb5DaEbA1Toeq54GyOv3MTx6txxfDTC/HlUBOXMzI3f107EvvYvcfmw2U02IrTJPQ819sZXunawL8mV9lm7GycnHps2KPcRbRYAHaLn1OnXn5nnq+gQOxVFErC2gJkG85Lb6yo3pYb+S6PavsevZ+8iyKIO8a9aaXapD50i6QrLr418ZaEnNXgSfVR/1YPGLPmfko/6KUYoeyrmNdUrLe94ULrgO0WjN8RbNuyPJwiSIEMqTUBonp5BY+7Dt1pQpRI6Wbuva8YDsVmaR+UwC2NlLAWvI2KXqZb6ZU1cMgY/KdHrGDuQpb2JCIsHCOdLv4grKavKgt/N1txBZBtCZPerjSYqNn8CPtsYY6EmzEhUgGbh2BFWkQwsJw+xY=';
        var tokenBox = [tone,ttwo,tthree];

        $scope.roomName = room;

        socket.emit('userInit',{room:$scope.roomName,token:tokenBox[index]});
        //socket.emit('userInit',{room:$scope.roomName});
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
        console.log('message.add',msg);
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

    socket.on('message.error',function(msg){
        console.log('messageError',msg);
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

