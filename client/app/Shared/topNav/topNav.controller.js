(function () {
    "use strict";
    angular
        .module('app.shared')
        .controller('topNavCtrl', topNavCtrl);

    topNavCtrl.$inject = ['authServices', '$scope', '$interval', '$q'];

    function topNavCtrl(authServices, $scope, $interval, $q) {
        /* jshint validthis: true */
        var vm = this;
        vm.logout = logout;

        vm.userType = authServices.getUserInfo().usertype;

        function logout() {
            authServices.logout();
        }
    }
})();