angular.module('chatModule',['ngRoute']);

angular.module('chatModule').factory('socket',function($rootScope) {
    var namespace = $rootScope.param.namespace;
    console.log('进入空间',namespace);
    var socket = io.connect('http://54.222.215.248/'+namespace);
    //var socket = io.connect('/'+namespace);

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
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

angular.module('chatModule').config(function($routeProvider){
    //进行路由的配置
    $routeProvider.when('/',{
        templateUrl:'../public/tmp/roomWithout.html',//模板
        controller:'roomCtrl'//控制器 是用来提供数据
    }).otherwise({
        redirectTo:'/'
    });
});
