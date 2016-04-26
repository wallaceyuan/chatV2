
angular.module('chatModule').controller('roomCtrl',function($rootScope,$scope,$timeout,socket,$location){
    $scope.status = false;$scope.dialog = false;
    $scope.ptop;
    $scope.messages = [],$scope.message = '',$scope.line = '',$scope.onlines = [],$scope.world = [],$scope.times= [];
    $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
    $scope.onlinesum = 0;
    $scope.chat = function(name){
        $scope.ptop = name;
    }
    $scope.createMessage = function(){
        if($scope.message){
            socket.emit('createMessage',{user:$scope.user,message:$scope.message,time:getTime()});
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

    $scope.line = $scope.user = randomString(5);

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
        if ($location.search().code) {
            var code = $location.search().code;
        }else{
            var code = 'MRSjYogg5WQ+q92N57YFY4z/lno4Oy0eqU0ztgRe5zTzOc+tHQkLBps+RgTI+e4ROsiyEPKeSwLKVlX5nKpYp/hStUvdNcbkuXZ2zsvHLvtijacLpJVvpB9Jpy4Hh04309yRdq/A+5DtcUJ24Ud1W4u0PvfTCaHoEdDjFQgpJzqsenXqJmv1tqQck6I6vu98yYydNjxXMpkEaWg8aZRfUj+YXPcqwhl81uqCVFz3Slpern9nNiKjz1mFnfltTU/ykm8+jtIXufhQrfALUycEvthnQ6kgbMg5ayupRgUW2bg1U0nDNN0n630B1bX2dh9pgYgyjCaubl6NmkDCcLNh67cJjc/EgFPiFsrOz8BYxAIECRLrEbRrGpUkJ2ilpfxgy1YFKlzbWRciJKSjjQOIL9wRaKvm1FyNG7oo+TZ86cGHstcmYy8I6QmvS3NhnO5k/kNwhISANny9z/D/YpqQdALEzY3G6uL4IUHYnxXlm4kfVvDEhY0n8lx9yM08XaZUCIxqaUiU8pLyQ7q+J9LYEVTNvfgFwbQ18ijf9qlfx0mqZorvpXvIATzDU98e6hKo86dIMXJPqa8nSXd/oSs7y4SM4G0cfYYMmMVCH+fIEq/052I85+b6tIMhhThGHq41WfcW2kEqXwP+FJvQ7Sygk1HR88/kFNJfQJV1VM1KkxI=';
        }

        $scope.roomName = room;

        socket.emit('userInit',{room:$scope.roomName,user:$scope.user,code:code});

    });

    socket.on('allMessages',function(data){
        console.log(data.users);
        $scope.onlines = data.users;
        $scope.onlinesum = data.onlinesum;
    });

    /*4.用户加入世界通知*/
    socket.on('joinChat',function(msg){
        console.log('joinChat',msg);
        var user = msg;
        $scope.ws = '';$scope.wss = '';
        $scope.world = {user:user.name,content:'上线了'};
        $scope.onlines.push(user);
        $scope.onlinesum = msg.onlinesum;

        $timeout.cancel($scope.promise);

        var timer = $timeout(function() {
            $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
            $timeout.cancel(timer);
        }, 3000);

    });

    socket.on('message.add',function(msg){
        //console.log(msg);
        if($.inArray(msg.time, $scope.times)>-1){
            msg.time = false;
        }else{
            $scope.times.push(msg.time);
        }
        if(msg.user == $scope.line){
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
        //alert('disconnext');
    });
});

function getTime(){
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
    var hour = t.getHours(),min = t.getMinutes(),sec=t.getSeconds();
    return hour+':'+min
}
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
