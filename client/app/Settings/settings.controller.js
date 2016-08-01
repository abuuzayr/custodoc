(function() {
    'use strict';

    angular
        .module("app.core")
        .controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', '$q', '$location', '$timeout', 'authServices', 'appConfig', '$http', 'feedbackServices'];

    function settingsCtrl($scope, $q, $location, $timeout, authServices, appConfig, $http, feedbackServices) {
        /* =========================================== Initialization =========================================== */
        /* jshint validthis: true */
        var vm = this;
        var userId = null;
        var userData = null;
        getUserInfo();
        /* =========================================== Main =========================================== */
        /**
         * Checks if the new password is similar to the confirm new pas sword. 
         * Returns feedback if false, else update database to change password.
         * @returns {true} if true
         * @returns {false} if false
         */
        function validateNewPassword() {
            if (vm.confirmNewPwd === vm.newPwd) {
                return true;
            } else {
                feedbackServices.errorFeedback('New password inputs do not match', 'settings-feedbackMessage');
                return false;
            }
        }

        /**
         * Get user information from id token and load into global variables
         */
        function getUserInfo() {
            try {
                userData = authServices.getUserInfo();
                userId = userData._id;
                vm.username = userInfo.username;
                vm.email = userInfo.email;
            } catch (err) {
                //feedbackServices.errorFeedback('error retriving user information', 'settings-feedbackMessage');
            }
        }

        /**
         * Call to update function to update username and/or email in usermgmt database. 
         */
        function updateInfo() {
            var userData = {
                username: vm.username,
                eamil: vm.email
            };
            update(userData);
        }


         /**
         * API Call to authenticate old password input by user.
         * @param {string} email - email of this user
         * @param {string} password - old password from user input
         * @returns {Promise <String | Error >} deferred.promise 
         */
        function authenticateOldPassword(email, password) {
            var deferred = $q.defer();
            $http.post(appConfig.AUTH_URL, {
                    email: email,
                    psw: password
                })
                .then(SuccessCallback)
                .catch(ErrorCallback);

            return deferred.promise;

            function SuccessCallback(res) {
                deferred.relove(res.data);
            }

            function ErrorCallback(err) {
                deferred.reject(err);
            }
        }

        /**
         * Call update function to update password.
         */
        function updatePassword() {
            var newPassword = vm.newPwd;
            if (validateNewPassword()) {
                authenticateOldPassword(userData.email, vm.oldPwd).then(resolve);
            }

            function resolve() {
                var userData = {
                    password: newPassword
                };
                update(userData);
            }
        }

        /**
         * API call to update user data in usermgmt database.
         */
        function update(userData) {
            $http.put(appConfig.UM_URL + '/' + userId, userData).then(SuccessCallback).catch(ErrorCallback);

            function SuccessCallback(res) {
                feedbackServices.successFeedback('Updated', 'settings-feedbackMessage');
            }

            function ErrorCallback(err) {
                feedbackServices.errorFeedback(err.data, 'settings-feedbackMessage');
            }
        }

        /**
         * API call to update user data in usermgmt database.
         * @return {Object} - Storage object
         */
        function getStorage() {
            //TODO
        }

        /* =========================================== Progress bar =========================================== */
        // Retrieve max and used storage here.
        var usedStorage = 80;
        vm.storageSpace = usedStorage + 'GB/100GB';
        document.querySelector('#progressBarStorage').addEventListener('mdl-componentupgraded', function() {
            this.MaterialProgress.setProgress(usedStorage);
        });
    }
})();
