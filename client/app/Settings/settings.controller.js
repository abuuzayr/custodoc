(function () {
    'use strict';

    angular
        .module("app.core")
        .controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', '$q', '$location', '$timeout'];

    function settingsCtrl($scope, $q, $location, $timeout) {
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
        /* jshint validthis: true */
        var vm = this;

        function validateNewPassword() {
            if (vm.confirmNewPwd === vm.newPwd) {
                vm.pwd.newPwd = vm.newPwd;
                return changePassword();
            }
            return feedbackServices.hideFeedback('#settings-feedbackMessage').
                then(feedbackServices.errorFeedback('New password inputs do not match', '#settings-feedbackMessage'));
        }

        /* =========================================== Progress bar =========================================== */
        // Retrieve max and used storage here.
        vm.storageSpace = '80GB/100GB';
        var usedStorage = 80;
        document.querySelector('#progressBarStorage').addEventListener('mdl-componentupgraded', function () {
            this.MaterialProgress.setProgress(usedStorage);
        });
    }
})();