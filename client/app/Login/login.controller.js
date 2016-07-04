angular.module("app.core")
    .controller("loginCtrl", loginCtrl);
    
    loginCtrl.$inject = ['$scope','$q','$location','$timeout','$state','$http'];
    
    function loginCtrl($scope, $q, $location, $timeout, $state, $http) {
    	
    /* =========================================== Initialisation =========================================== */
    var vm = this;
    var errMsg;
    var MAX_PASSWORD_LENGTH = 24;
    var MIN_PASSWORD_LENGTH = 8;
    var baseURL = 'https://10.4.1.204/auth/user';
    vm.validateBeforeLogin = validateBeforeLogin;

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
    function validateBeforeLogin() {
        var email = '';
        var password = '';
        var errMsg = '';

        if (isEmpty(vm.email) || isEmpty(vm.password)) {
            return;
        } else if (!isValidEmail(vm.email)) {
            errMsg = 'Email is invalid.';
        } else if (!isValidPassword(vm.password)) {
            errMsg = 'Password is between 8 and 24 characters.';
        } else {
            email = vm.email
            password = vm.password;
            return login(email, password);
        }
            //TODO 
        console.log('Error'+errMsg);
    }    




    function login(email,password) {
            $http.post(baseURL, {
                email: email,
                password: password,
		        origin: 'bulletform.com'
            }).then(function SuccessCallback(res) {
                console.log(res);
                $state.go('forms');
            }, function ErrorCallback(err) {
                console.log(err);
                vm.loginFeedbackMessage = err.data.description;
            });
    };


    function isEmpty(str) {
        return str == null || str == undefined || str.length < 1 ;
    };

    function isValidEmail(str) {
        var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailPattern.test(str);
    };

    function isValidPassword(inputStr) {
        return inputStr.length >= MIN_PASSWORD_LENGTH && inputStr.length <= MAX_PASSWORD_LENGTH
    }


    /* =========================================== Forgot password =========================================== */

    // Check if email is valid.
    vm.checkUserValid = function () {
        //Check for email syntax first before sending.
        if (!isValidEmail($scope.forgotUser))
            $scope.isUsernameConfirmed = false;
        else {
            var path = 'http://localhost:8080/api/user/forgetpassword';
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

