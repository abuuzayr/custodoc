angular
    .module('app.shared')
    .directive('topNavBar', topNavBar);

function topNavBar() {
    return {
        restrict: 'EA',
        controller: 'topNavCtrl',
        controllerAs: 'vm',
        templateUrl: 'app/Shared/topNav/topNav.template.html',
        link:function(){
            console.log('linking');
        }
    };
}    