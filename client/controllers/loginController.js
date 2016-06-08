angular
    .module('user-interface')
    .controller("loginCtrl", ["$scope", '$rootScope', '$location', '$timeout', function ($scope,$rootScope, $location, $timeout) {
        $rootScope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                componentHandler.upgradeAllRegistered();
            });
        });
        $scope.state = 'login';
    }]);