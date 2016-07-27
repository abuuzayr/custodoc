(function () {
    'use strict';

    angular
        .module("app.core")
        .controller('usersCtrl', usersCtrl);

    usersCtrl.$inject = ['$scope', '$q', '$location', '$timeout', 'dialogServices', 'feedbackServices', 'authServices'];

    function usersCtrl($scope, $q, $location, $timeout, dialogServices, feedbackServices, authServices) {
        /* =========================================== Initialization =========================================== */
        /* jshint validthis: true */
        var vm = this;
        var addUserId = 0;
        var MIN_PASSWORD_LENGTH = 8;
        var MAX_PASSWORD_LENGTH = 24;
        vm.users = [];
        vm.userGroups = ["Admin", "User+", "User"];
        var companyName = authServices.getUserInfo().companyName;
        var companyId = authServices.getUserInfo().companyId;

        vm.openDialog = openDialog;
        vm.closeDialog = closeDialog;
        vm.addUser = addUser;
        vm.editUser = editUser;
        vm.removeUser = removeUser;
        vm.loadEditInfo = loadEditInfo;
        vm.createInDatabase = createInDatabase;
        vm.updateDatabase = vm.updateDatabase;
        // vm.deleteFromDatabase = vm.deleteFromDatabase;

        /* =========================================== Load animation =========================================== */
        upgradeMDLDom();
        /**
         * Upgrades DOM of MDL components after page content has been loaded.
         */
        function upgradeMDLDom() {
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
        }

        /* =========================================== Add/Edit user =========================================== */
        /**
         * Adds user to database and vm.users if form submission is valid. Returns display error feedback message otherwise.
         */
        function addUser() {
            if ($scope.newUserForm.$valid) {
                pushElement();
                clearFormInputs();
                createInDatabase();
                closeDialog('userDialog');
            } else {
                if (vm.password.length <= MIN_PASSWORD_LENGTH && vm.password.length >= MAX_PASSWORD_LENGTH) {
                    errMsg = 'Password length should be 8-24 characters';
                } else {
                    errMsg = 'Invalid form submission';
                }
                return feedbackServices.hideFeedback('#newUser-feedbackMessage')
                    .then(feedbackServices.errorFeedback(errMsg, 'newUser-feedbackMessage'));
            }
        }

        /**
         * Pushes a new user element into vm.users.
         */
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

        /**
         * Resets all fields in form. Triggered after every form submission. 
         */
        function clearFormInputs() {
            vm.username = '';
            vm.password = '';
            vm.email = '';
            vm.selectedUserType = '';
        }

        /**
         * Edits user corresponding to vm.editId and update database if form is valid. Returns display error message otherwise.
         */
        function editUser() {
            if ($scope.newUserForm.$valid) {
                vm.users[vm.editId].username = vm.username;
                vm.users[vm.editId].password = vm.password;
                vm.users[vm.editId].email = vm.email;
                vm.users[vm.editId].selectedUserType = vm.selectedUserType;
                // updateDatabase(userId);
                clearFormInputs();
                feedbackServices.successFeedback('Users edited successfully', 'newUser-feedbackMessage');
                closeDialog('userDialog');
            } else {
                console.log('edituser PHAIL');
                return feedbackServices.hideFeedback('#newUser-feedbackMessage')
                    .then(feedbackServices.errorFeedback('Invalid form submission', 'newUser-feedbackMessage'));
            }
        }
        
        /**
         * Removes user from vm.users and database. 
         * 
         * @param {string} username
         */
        function removeUser(username) {
            // TODO: delete user in database and add feedback message
            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].username === username) {
                    vm.users.splice(i, 1);
                }
            }
            addUserId--;
        }

        /**
         * Loads information of user to-be-edited into the form. Triggered when editDialog opens.
         * 
         * @param {any} username
         */
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
        /**
         * Opens modal dialog of dialogName.
         * 
         * @param {string} dialogName
         */
        function openDialog(dialogName) {
            dialogServices.openDialog(dialogName);
        }
        
        /**
         * Closes modal dialog of dialogName.
         * 
         * @param {string} dialogName
         */
        function closeDialog(dialogName) {
            dialogServices.closeDialog(dialogName);
        }
        
        /**
         * Converts user information in array to json form to be stored in database. 
         * 
         * @returns {json} newUserData
         */
        function convertUserData() {
            var newUserData = {};
            newUserData.companyId = companyId;
            newUserData.companyName = companyName;
            newUserData.email = vm.users[addUserId].email;
            newUserData.username = vm.users[addUserId].username;
            newUserData.password = vm.users[addUserId].password;
            newUserData.bulletform = {};
            newUserData.bulletform.usertype = vm.users[addUserId].selectedUserType;
            return newUserData;
        }

        /* =========================================== API =========================================== */
        function createInDatabase() {
            var newUserData = convertUserData();
            var path = '/usermgmt';
            var req = {
                method: 'POST',
                url: appConfig.UM_URL + path,
                headers: {},
                data: {
                    userData: newUserData
                }
            };

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

        function updateDatabase(userId) {
            var newUserData = convertUserData();
            var req = {
                method: 'PUT',
                // TODO retrieve vm.userId
                url: appConfig.UM_URL + userId,
                headers: {},
                data: {
                    userData: newUserData
                }
            };

            $http(req)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                return feedbackServices.successFeedback('User info updated', '#editUser-feedbackMessage', 2000).then(delayGoState(3000));
            }

            function ErrorCallback(err) {
                return feedbackServices.errorFeedback(err.data, '#editUser-feedbackMessage');
            }

            getFromDatabase(companyId);
            function getFromDatabase(company_id) {
                var path = '/usermgmt';
                var req = {
                    method: 'GET',
                    url: appConstant.API_URL + path + '/' + company_id,
                    headers: {}
                };
                if ($window.sessionStorage.token) {
                    req.headers.Authorization = $window.sessionStorage.token;
                }
                $http(req)
                    .then(SuccessCallback)
                    .catch(ErrorCallback);

                function SuccessCallback(res) {
                    vm.userData = res.data.userData;

                    if (vm.userData.application.bulletform.enabled === true && vm.userData.application.bulletform.isUser === true) {
                        vm.users.push({
                            username: vm.userData.username,
                            password: vm.userData.password,
                            email: vm.userData.email,
                            selectedUserType: vm.userData.application.bulletform.usertype

                        });
                        addUserId++;
                    }
                    $timeout(function () {
                        componentHandler.upgradeDom();
                    }, 0);
                }

                function ErrorCallback(err) {
                    console.log('GET USER INFO ERROR BLOP BLOP.');
                }
            }
        }
    }
})();
