angular
    .module("app.core")
    .controller("usersCtrl", ['$scope', '$q', '$location', '$timeout', 'dialogServices', 'feedbackServices', function ($scope, $q, $location, $timeout, dialogServices, feedbackServices) {
        var vm = this;
        var addUserId = 0;
        var MIN_PASSWORD_LENGTH = 8;
        var MAX_PASSWORD_LENGTH = 24;
        vm.users = [];
        vm.userGroups = ["Admin", "User+", "User"];
        // TODO
        vm.companyName = '';
        vm.companyId = '';

        vm.openDialog = openDialog;
        vm.closeDialog = closeDialog;
        vm.addUser = addUser;
        vm.editUser = editUser;
        vm.removeUser = removeUser;
        vm.loadEditInfo = loadEditInfo;

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

        /* =========================================== Add/Edit user =========================================== */
        function addUser() {
            if ($scope.newUserForm.$valid) {
                pushElement();
                clearFormInputs();
                closeDialog('userDialog');
                feedbackServices.successFeedback('User added successfully', 'newUser-feedbackMessage');
            } else {
                if (vm.password.length <= MIN_PASSWORD_LENGTH && vm.password.length >= MAX_PASSWORD_LENGTH) {
                    errMsg = 'Password length should be 8-24 characters';
                } else {
                    errMsg = 'Invalid form submission';
                }
                console.log('Add user unsuccessful');
                feedbackServices.errorFeedback(errMsg, 'newUser-feedbackMessage');
            }
        }

        function pushElement() {
            vm.users[addUserId] = {
                id: addUserId,
                username: vm.username,
                password: vm.password,
                email: vm.email,
                selectedUserType: vm.selectedUserType,
            };
            addUserId++;
        }

        function clearFormInputs() {
            vm.username = '';
            vm.password = '';
            vm.email = '';
            selectedUserType = '';
        }

        function editUser() {
            if ($scope.newUserForm.$valid) {
                vm.users[vm.editId].username = vm.username;
                vm.users[vm.editId].password = vm.password;
                vm.users[vm.editId].email = vm.email;
                vm.users[vm.editId].selectedUserType = vm.selectedUserType;
                clearFormInputs();
                feedbackServices.successFeedback('Users edited successfully', 'newUser-feedbackMessage');
                closeDialog('userDialog');
            } else {
                console.log('edituser PHAIL');
                feedbackServices.errorFeedback('Invalid form submission', 'newUser-feedbackMessage');
            }
        }

        function removeUser(username) {
            // TODO: delete user in database
            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].username === username) {
                    vm.users.splice(i, 1);
                }
            }
            addUserId--;
        }

        function loadEditInfo(username) {
            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].username === username) {
                    vm.editId = i;
                    vm.username = vm.users[i].username;
                    vm.password = vm.users[i].password;
                    vm.email = vm.users[i].email;
                    vm.selectedUserType = vm.users[i].selectedUserType;
                }
            }
        }

        /* =========================================== Dialog =========================================== */
        function openDialog(dialogName) {
            dialogServices.openDialog(dialogName);
        }

        function closeDialog(dialogName) {
            dialogServices.closeDialog(dialogName);
        }

        function convertUserData() {
            var path = '/protected/user';
            var newUserData = {};
            newUserData.companyId = vm.companyId;
            newUserData.companyName = vm.companyName;
            newUserData.email = vm.users[i].email;
            newUserData.username = vm.users[i].username;
            newUserData.password = vm.users[i].password;
            newUserData.bulletform = {};
            newUserData.bulletform.usertype = vm.users[i].selectedUserType;
            return newUserData;
        }


        /* =========================================== API =========================================== */
        function createInDatabase() {
            var newUserData = convertUserData();
            var path = '/protected/user';
            var req = {
                method: 'POST',
                url: appConstant.API_URL + path,
                headers: {},
                data: {
                    userData: newUserData
                }
            };
            
            // TODO
            if ($window.sessionStorage.token) {
                req.headers.Authorization = $window.sessionStorage.token;
            }

            $http(req)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                return feedbackServices.hideFeedback('#newUser-feedbackMessage')
                    .then(feedbackServices.successFeedback('User created', '#newUser-feedbackMessage', 2000))
                    .then(delayGoState(3000));
            }

            function ErrorCallback(err) {
                return feedbackServices.hideFeedback('#newUser-feedbackMessage').
                    then(feedbackServices.errorFeedback(err.data, '#newUser-feedbackMessage'));
            }
        }

        function updateDatabase() {
            var newUserData = convertUserData();
            var path = '/protected/user/';
            var req = {
                method: 'PUT',
                url: appConstant.API_URL + path + vm.userId,
                headers: {},
                data: {
                    userData: newUserData
                }
            };
            
            // TODO
            if ($window.sessionStorage.token) {
                req.headers.Authorization = $window.sessionStorage.token;
            }

            $http(req)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                return feedbackServices.successFeedback('User info updated', '#editUser-feedbackMessage', 2000).then(delayGoState(3000));
            }

            function ErrorCallback(err) {
                return feedbackServices.errorFeedback(err.data, '#editUser-feedbackMessage');
            }
        }


    }]);
