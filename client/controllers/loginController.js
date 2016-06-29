angular
    .module("user-interface")
    .controller("loginCtrl", [
        '$scope',
        '$q',
        '$location',
        '$timeout',
        '$state',
        '$http',
        loginCtrl
    ]);
function loginCtrl(
    $scope,
    $q,
    $location,
    $timeout,
    $state,
    $http) {

    /* =========================================== Initialisation =========================================== */
    var vm = this;
    vm.isLoginSuccessful = true;
    vm.login = login;

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
    function login() {
        vm.isValidForLogin = (!isEmpty(usr) && !isEmpty(pwd) && isValidEmail(usr));
        if (vm.isValidForLogin) {
            //Start login
            var usr = vm.email;
            var pwd = vm.password;
            var baseURL = 'http://localhost:8080/api/userauth';
            console.log(usr);
            $http.post(baseURL, {
                email: usr,
                password: pwd
            }).then(function SuccessCallback(res) {
                //To see the msg do console.log(res)
                console.log(res);
                //TODO: What to do when email is sent? Go through viewcontroller to check jwt
                $state.go('forms');
            }, function ErrorCallback(err) {
                //To see the msg do console.log(err)
                console.log(err);
                //TODO: What to do when call is not successful
                vm.loginFeedbackMessage = err.data.description;
            });
        }
        else {
            //If inputs are not valid, display feedback message
            setLoginFeedback();
        }
    };

    function setLoginFeedback() {
        if ((isEmpty(usr) || isEmpty(pwd)) === true) {
            vm.loginFeedbackMessage = 'Please enter both email and password.';
        }
        if (isValidEmail(usr) === false) {
            vm.loginFeedbackMessage = 'Invalid email. Please re-enter email.';
        }
    };

    function isEmpty(str) {
        if (str != null && str != undefined && str.length >= 1) {
            return false;
        }
        else return true;
    };

    function isValidEmail(str) {
        var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailPattern.test(str);
    };

    /* ===========================================    HTTP CALLS   =========================================== */

    /* =========================================== Forgot password =========================================== */
    // Set isUsernameConfirmed to null to hide feedback messages.
    vm.isUsernameConfirmed = null;

    // API here. Retrieve user's email.
    vm.email = '';

    // Check if email is valid.
    vm.checkUserValid = function () {
        //Check for email syntax first before sending.
        if (!isValidEmail($scope.forgotUser))
            $scope.isUsernameConfirmed = false;
        else {
            var baseURL = 'http://localhost:8080/api/user/forgetpassword';
            var email = $scope.forgotUser;
            $http.get(baseURL + '/' + email)
                .then(function SuccessCallback(res) {
                    //To see the msg do console.log(res)
                    //console.log(res);
                    //TODO: What to do when email is sent?
                    vm.forgotPasswordFeedbackMessage = 'Your new auto-generated password is sent to ' + vm.forgotPasswordEmail;
                }, function ErrorCallback(err) {
                    //To see the msg do console.log(err)
                    //console.log(err);
                    //TODO: What to do when call is not successful
                });

        }
    };

    /* =========================================== Dialog =========================================== */
    vm.openDialog = function (dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    };

    vm.closeDialog = function (dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        dialog.close();
        vm.isUsernameConfirmed = null;
    };
}