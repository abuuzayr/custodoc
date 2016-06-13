angular
    .module("user-interface")
    .controller("loginCtrl", ['$scope', '$q', '$location', '$timeout', '$state', function ($scope, $q, $location, $timeout, $state) {
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
        $scope.checkRequired = function() {
            var usr = $scope.username;
            var pwd = $scope.password;
            $scope.isEmpty = (usr === undefined) || (pwd === undefined);
            var redirect = (!$scope.isInvalid && !$scope.isEmpty);
            if(redirect) {
                // Redirect to forms page
                $state.go('forms');
            }
        };
        
        /* =========================================== Forgot password =========================================== */
        $scope.isUsernameConfirmed = null;
        $scope.email = 'hello@example.com'
        // Check if username is valid.
        $scope.checkUserValid = function() {
            var usr = $scope.forgotUser;
            // Checking API here.
            if(true) { // TODO: stub
                $scope.isUsernameConfirmed = true;
            } else {
                $scope.isUsernameConfirmed = false;
            }
        }
        
        /* =========================================== Dialog =========================================== */
        $scope.openDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
            dialog.showModal();
        };
        $scope.closeDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            dialog.close();
            $scope.isUsernameConfirmed = null;
        };
    }]);