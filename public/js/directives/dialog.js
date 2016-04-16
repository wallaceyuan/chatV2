angular.module('chatModule').directive('showDialog',function(){
    return {
        link:function($scope,element,attrs){

        },
        template:'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> ' +
        '<div class="modal-dialog" role="document"> ' +
        '<div class="modal-content"> ' +
        '<div class="modal-header"> ' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> ' +
        '<h4 class="modal-title" id="myModalLabel">要和{{ptop}}私聊吗:-D</h4></div> ' +
        '<div class="modal-footer"> ' +
        '<button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="$broadcast(\'start\',line,ptop)">确定</button> ' +
        '</div></div></div></div> '
    }
});