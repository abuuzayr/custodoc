(function () {
    "use strict";
    angular
        .module('app.shared')
        .directive('topNavBar', topNavBar);

    function topNavBar() {
        return {
            restrict: 'EA',
            scope: {},
            transclude: true,
            controller: 'topNavCtrl',
            controllerAs: 'vm',
            replace: true,
            templateUrl: 'app/Shared/topNav/topNav.html'
        };
    }
})();
