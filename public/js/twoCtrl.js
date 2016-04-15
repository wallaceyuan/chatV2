/**
 * Created by yuan on 2016/4/15.
 */
angular.module('chatModule').controller('twoCtrl',function($scope,$timeout,socket){
    $scope.$on('add',function(event,num){
        $scope.two = 11111111;
    });
});
