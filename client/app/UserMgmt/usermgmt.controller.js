(function() {
    'use strict';

    angular
        .module("app.core")
        .controller('usersCtrl', usersCtrl);

    usersCtrl.$inject = ['$scope', '$q', '$timeout', 'dialogServices', 'feedbackServices', 'authServices', 'usermgmtServices'];

    function usersCtrl($scope, $q, $timeout, dialogServices, feedbackServices, authServices, usermgmtServices) {
        /* =========================================== Initialization =========================================== */
        /* jshint validthis: true */
        var vm = this;
        var addUserId = 0;
        var MIN_PASSWORD_LENGTH = 8;
        var MAX_PASSWORD_LENGTH = 24;
        vm.users = [];
        vm.userGroups = ["Admin", "User+", "User"];

        vm.tableOptions = {};
        vm.tableOptions.data = [];
        vm.tableOptions.enableMultiSelect = true;
        vm.tableOptions.eanblePagination = true;
        getUsers();
        vm.tableOptions.columnDefs = [
            { type: 'action', icon: 'edit', action: goEditUser },
            { type: 'default', displayName: 'Username', fieldName: 'username' },
            { type: 'default', displayName: 'Email', fieldName: 'email' },
            { type: 'default', displayName: 'Usertype', fieldName: 'usertype' }
        ];
        vm.tableOptions.deleteFunc = deleteUsers;

        vm.openDialog = openDialog;
        vm.closeDialog = closeDialog;

        function goEditUser() {
            console.log('goEditUser') //TOFIX
        }

        /**
         * Get users from database and load into vm.tableOptions.data
         */
        function getUsers() {
            return usermgmtServices.getUsers().then(SuccessCallback).catch(ErrorCallback);

            function SuccessCallback(res) {
                vm.tableOptions.data = res.data;
            }

            function ErrorCallback(err) {
                feedbackServices.errorFeedback(err.data, 'usermgmt-feedbackMessage');
            }
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
                return feedbackServices.errorFeedback(errMsg, 'usermgmt-feedbackMessage');
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
                feedbackServices.successFeedback('Users edited successfully', 'usermgmt-feedbackMessage');
                closeDialog('userDialog');
            } else {
                console.log('edituser PHAIL');
                return feedbackServices.errorFeedback('Invalid form submission', 'usermgmt-feedbackMessage');
            }
        }

        /**
         * Removes one or many users from selection and database. 
         * 
         * @param {Object Array} selected user data
         */
        function deleteUsers(rgUsers) {
            var deferred = $q.defer();
            var rgPromises = [];
            for (var i = 0; i < rgUsers.length; i++) {
                rgPromises.push(
                    (rgUsers._id));
            }
            $q.all(rgPromises).then().catch();
            return deferred.promise;

            function SuccessCallback(res) {
                deferred.resolve();
            }

            function ErrorCallback(err) {
                deferred.reject(err);
            }
        }


        /**
         * Removes one user from selection and database. 
         * 
         * @param {string} userId
         */
        function deleteOne(userId) {
            var deferred = $q.defer();

            usermgmtServices.deleteUser(userId)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            return deferred.promise;

            function SuccessCallback(res) {
                for (var i = 0; i < vm.tableOptions.length; i++) {
                    if (vm.tableOptions.data[i]._id === userId) {
                        vm.tableOptions.data.splice(i, 1);
                    }
                }
                deferred.resolve();
                return feedbackServices.successFeedback('User Deleted', 'usermgmt-feedbackMessage', 2000);
            }

            function ErrorCallback(err) {
                deferred.reject(err);
                return feedbackServices.successFeedback(err.data, 'usermgmt-feedbackMessage', 2000);
            }
        }

        /**
         * Add one user to database. 
         * 
         * @param {object} userData
         */
        function createUser(userData) {
            return usermgmtServices.createUser(userData)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                return feedbackServices.successFeedback('User created', 'usermgmt-feedbackMessage', 2000).then(delayGoState(3000));
            }

            function ErrorCallback(err) {
                return feedbackServices.errorFeedback(err.data, 'usermgmt-feedbackMessage');
            }
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
            dialogServices.openDialog('usermgmtDialog');
        }

        /**
         * Closes modal dialog of dialogName.
         * 
         * @param {string} dialogName
         */
        function closeDialog(dialogName) {
            dialogServices.closeDialog('usermgmtDialog');
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



    }
})();
