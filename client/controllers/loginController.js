angular
    .module('user-interface')
    .controller("loginCtrl", ["$scope", function ($scope) {
        $scope.state = 'login';
    }]);