angular
    .module("app.shared")
    .controller("topNavCtrl", ['authServices','$scope', '$interval', function (authServices, $scope, $interval) {
        var vm = this;
        vm.date = new Date();
        vm.logout = logout;
        
        $interval(function () {
            vm.date = new Date();
        }, 1000);

        vm.username = authServices.getUserInfo().username;
        vm.userType = authServices.getUserInfo().usertype;
        
        function logout() {
            authServices.logout();
        }

    }]);