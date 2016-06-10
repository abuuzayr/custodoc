angular
    .module("user-interface")
    .controller("newEntryCtrl", ['$scope', '$q', '$location', '$timeout', function ($scope, $q, $location, $timeout) {
        var viewContentLoaded = $q.defer();
        
        $scope.$on('$viewContentLoaded', function () {
            $timeout(function () {
                viewContentLoaded.resolve();
            }, 0);
        });
        viewContentLoaded.promise.then(function () {
            $timeout(function () {
                componentHandler.upgradeDom();
            }, 0);
        });
    }]);