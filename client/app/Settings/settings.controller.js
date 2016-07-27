(function () {
    'use strict';

    angular
        .module("app.core")
        .controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', '$q', '$location', '$timeout'];

    function settingsCtrl($scope, $q, $location, $timeout) {
        /* =========================================== Initialization =========================================== */
        /* jshint validthis: true */
        var vm = this;
        
        /* =========================================== Main =========================================== */
        /**
         * Checks if the new password is similar to the confirm new password. 
         * Returns feedback if false, else update database to change password.
         * @returns {function} if true
         * @returns {promise} if false
         */
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