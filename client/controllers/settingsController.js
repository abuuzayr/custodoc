angular
    .module("user-interface")
    .controller("settingsCtrl", ["$scope", '$rootScope', '$location', '$timeout', function ($scope,$rootScope, $location, $timeout) {
        $rootScope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                componentHandler.upgradeAllRegistered();
            },10);
        })
    }]);