(function () {
    "use strict";
    angular
        .module('app.shared')
        .directive('topNavBar', topNavBar);

    function topNavBar() {
        return {
            restrict: 'EA',
            replace: true,
            controller: 'topNavCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/Shared/topNav/topNav.html'
        };
    }
})();