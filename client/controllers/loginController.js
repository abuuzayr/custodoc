angular
    .module("user-interface")
    .controller("loginCtrl", ['$http','$scope', '$q', '$location', '$timeout', '$state', function ($scope, $q, $location, $timeout, $state, $http) {
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

        /* =========================================== Login =========================================== */
        // If invalid username/password, show feedback message. Else, hide. Auth API here.
        $scope.isInvalid = false;

        // Checks if input is empty. If empty, show feedback. Else, hide.
        $scope.checkRequired = function () {
            var usr = $scope.username;
            var pwd = $scope.password;

            $scope.isEmpty = (!checkIsEmpty(usr) || !checkIsEmpty(pwd));
            var redirect = (!$scope.isInvalid && !$scope.isEmpty);
            if (redirect) {
                // Redirect to forms page
                $state.go('forms');
            }
        };

        var checkIsEmpty = function(str) {
            if(str != null && str!= undefined && str.length >= 1) {
                return true;
            }
            else return false;
        };

        var checkIsValidEmail = function(str){
            var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailPattern.test(str);
        };

        /* ===========================================    HTTP CALLS   =========================================== */

        /* =========================================== Forgot password =========================================== */
        // Set isUsernameConfirmed to null to hide feedback messages.
        $scope.isUsernameConfirmed = null;
        
        // API here. Retrieve user's email.
        $scope.email = '';
        
        // Check if username is valid.
        $scope.checkUserValid = function ($http) {
            if(!checkIsValidEmail($scope.forgotUser))
                 $scope.isUsernameConfirmed = false;


            $http.get('localhost:8080/api/user/forget_password'+email)
            var email = $scope.forgotUser;
            // Checking API here.
            
            if (true) { // TODO: stub
                $scope.isUsernameConfirmed = true;
            } else {
                $scope.isUsernameConfirmed = false;
            }
        };

        /* =========================================== Dialog =========================================== */
        $scope.openDialog = function (dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();
        };
        
        $scope.closeDialog = function (dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            dialog.close();
            $scope.isUsernameConfirmed = null;
        };
    }]);