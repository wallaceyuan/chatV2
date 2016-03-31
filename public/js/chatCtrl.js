/**
 * Created by yuan on 2016/3/31.
 */

angular.module('chatModule',['ngRoute','firebase']);
angular.module('chatModule').factory('socket',function($rootScope) {
    var socket = io.connect('/');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            console.log('emit',eventName,data);
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        send:function(data){
            console.log(data);
            socket.send(data);
        }
    };
});
angular.module('chatModule').factory('chatService', function ($http) {
    return {
        login:function(data){
            return $http.post('/login',data);
        }
    }
});

//config进行路由配置
angular.module('chatModule').config(function($routeProvider){
    //进行路由的配置
    $routeProvider.when('/room',{
        templateUrl:'tmp/room.html',//模板
        controller:'roomCtrl'//控制器 是用来提供数据
    }).otherwise({
        redirectTo:'/room'
    });
});
