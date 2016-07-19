angular
    .module("app.core")
    .controller("settingsCtrl", ['$scope', '$q', '$location', '$timeout', function ($scope, $q, $location, $timeout) {
        /* =========================================== Load animation =========================================== */
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
        /* =========================================== Stubs =========================================== */
        var vm = this;
        
        
        
        $scope.email = 'hello@example.com';
        $scope.companyExpiry = '1/1/2017';
        
        /* =========================================== Progress bar =========================================== */
        // Retrieve max and used storage here.
        $scope.storageSpace = '80GB/100GB';
        var usedStorage = 80;
        document.querySelector('#progressBarStorage').addEventListener('mdl-componentupgraded', function() {
         this.MaterialProgress.setProgress(usedStorage);
      });
    }]);