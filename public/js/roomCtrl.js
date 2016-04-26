
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
            var code = 'sVq+gmy87l79jQ1fBHb8mgiSKNekY0IQQ+7GgrLBXVv6aTTspZAmqg1WfpCwWrnYIA4IdVwARStSVN+OxWCE/j0grhjgZHvka+no1lMEOtJMHjlKaBi8o//8nNm81WeJq5r7Dvaf6ntUwue204X0lXFNo3lxDP38qF8qown4XdjHO7iXLRmhxIy/Sp8qnFao8QbrBheR4opVJ3s85Z+PgXYdf+OdBFTd/lnpRkJShFF9iwETh1KWdhT46hfuB1rT7OwtgNrIhO3tA33DqKiGXaxt7E12SRYmb0SHjRfeP6cZfy0SVt7hiJqcHivMtWLuH/h0IGql3pwe98k31tzIsEnU/KMFDB6TsPv37jyWT6/vid9IrauF2j5Mnp3a07H5wyVBc/P0ESryT82UYMaZ1LoufD/ZRgYkYbVVjFPTuMWzbFJWcwVc5W8OKEXEN9es/aOs58J7VzzwxcLtWCSMeYsiTZPEmVN807cUwyRHA80aKz9OPe+mGK4ibD8GXa3McQBTIAkskTdpAh6SFVwzQObFe2Cx21sH1g5Z28zvFc9r/jue5UT8rX8tQ28VlkWqIEA8RY9qeLZgtGjV7QsYk9LS3fcrm6WL0dj9GjwNUFWns46Es5gKsyccc5qpplHSSJCwTo5prOk6s5mN676pm27mFzoAKZb0jOjfDJDRzzs=';
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
