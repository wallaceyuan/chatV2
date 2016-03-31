/**
 * Created by yuan on 2016/3/31.
 */
angular.module('chatModule').controller('indexCtrl',function($rootScope,$scope,socket,chatService,$location){
    $scope.msg = {user: "系统", content: "请输入用户名"}
    $scope.subName = function(){
        if($scope.name){
            chatService.login({name:$scope.name}).success(function(data){
                if(data.code == 1){
                    socket.send($scope.name);
                    $location.path('/#room');
                }
            });
        }
    }
    socket.on('connect', function(){
        $scope.tip = 'Hello,Friend!';
    });
    socket.on('message',function(msg){
        $scope.msg = msg;
    });
});
