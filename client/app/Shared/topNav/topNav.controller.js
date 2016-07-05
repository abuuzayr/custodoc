angular
    .module("app.shared")
    .controller("topNavCtrl", ['authServices','$scope', '$window', '$state', '$interval', function (authServices, $scope, $window, $state, $interval) {
        var vm = this;
        vm.date = new Date();
        vm.logout = logout;
        
        $interval(function () {
            vm.date = new Date();
        }, 1000);
        
        vm.userInfo = authServices.getUserInfo();

        vm.userGroup = vm.userInfo.usertype;
        vm.email = vm.userInfo.email;
        vm.username = vm.userInfo.username;

        function logout() {
            authServices.logout();
        }

    }]);