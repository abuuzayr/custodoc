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
        var MIN_PASSWORD_LENGTH = 8;
        var MAX_PASSWORD_LENGTH = 24;
        vm.userGroups = ["Admin", "User+", "User"];

        vm.tableOptions = {};
        vm.tableOptions.data = [];
        vm.tableOptions.enableMultiSelect = true;
        vm.tableOptions.enablePagination = true;
        getUsers();
        vm.tableOptions.columnDefs = [
            { type: 'action', icon: 'edit', action: editUser },
            { type: 'default', displayName: 'Username', fieldName: 'username' },
            { type: 'default', displayName: 'Email', fieldName: 'email' },
            { type: 'default', displayName: 'Usertype', fieldName: 'usertype' }
        ];
        vm.tableOptions.deleteFunc = deleteUsers;

        vm.openDialog = openDialog;
        vm.closeDialog = closeDialog;
        vm.editUser = editUser;
        vm.addUser = addUser;
        vm.discardEdit = discardEdit;
        vm.discardAdd = discardAdd;
        vm.saveEdit = saveEdit;
        vm.saveAdd = saveAdd;

        function editUser(user) {
            vm.userInEdit = user;
            openDialog('editUser-dialog');
        }

        function saveEdit(user) {
            var userData = constructUserData(user);
            return createUser(userData)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                feedbackServices.successFeedback('User created', 'usermgmt-feedbackMessage', 2000);
                discardEdit();
            }

            function ErrorCallback(err) {
                feedbackServices.errorFeedback(err.data, 'usermgmt-feedbackMessage', 2000);
            }
        }

        function discardEdit() {
            vm.userInEdit = null;
            closeDialog('editUser-dialog');
        }

        function addUser() {
            vm.newUser = {
                username: '',
                email: '',
                password: '',
                usertype: ''
            };
            openDialog('addUser-dialog');
        }

        function saveAdd(user) {
            var userData = constructUserData(user);
            return createUser(userData)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                discardAdd();
                feedbackServices.successFeedback('User created', 'usermgmt-feedbackMessage', 2000);
            }

            function ErrorCallback(err) {
                feedbackServices.errorFeedback(err.data, 'usermgmt-feedbackMessage', 2000);
            }
        }

        function discardAdd() {
            closeDialog('addUser-dialog');
            vm.newUser = null;
        }

        /**
         * Converts user information in array to json form to be stored in database. 
         * 
         * @returns {json} newUserData
         */
        function constructUserData(data) {
            return data;
        }


        /**
         * Get users from database and load into vm.tableOptions.data
         */
        function getUsers() {
            return usermgmtServices.getUsers().then(SuccessCallback).catch(ErrorCallback);

            function SuccessCallback(res) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    data[i].usertype = data[i].application.bulletform.usertype;
                }
                vm.tableOptions.data = data;
            }

            function ErrorCallback(err) {
                feedbackServices.errorFeedback(err.data, 'usermgmt-feedbackMessage');
            }
            // var data = [{
            //     "_id": "577a28d1512472c23dfd49d1",
            //     "updatedAt": "2016-07-05T03:56:24.799Z",
            //     "createdAt": "2016-07-04T09:13:53.295Z",
            //     "username": "danny222",
            //     "email": "danielz62@hotmail.com",
            //     "password": "$2a$10$YYHm60Ub1qBFeozPPdgItuLFHx7DAeQNzVOKdFTJ6UQ/wMekWlNDS",
            //     "companyId": "577a1014ddde2f740b8431ec",
            //     "companyName": "Razor",
            //     "application": {
            //         "bulletform": {
            //             "formbuilder": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "entrymgmt": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "formmgmt": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "autofill": {
            //                 "delete": false,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "usermgmt": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "isUser": true,
            //             "usertype": "Admin"
            //         },
            //         "bulletlead": {
            //             "isUser": false
            //         }
            //     },
            //     "__v": 0
            // }, {
            //     "_id": "578c342fee56d5ec6972834f",
            //     "updatedAt": "2016-07-18T01:43:11.878Z",
            //     "createdAt": "2016-07-18T01:43:11.878Z",
            //     "username": "test2",
            //     "email": "test@test.com",
            //     "password": "$2a$10$imgjDgYfiUNOqCYLbjpG5OWO.Hes/4O17iCvfzb3bG.y0svS0155.",
            //     "companyId": "577a1014ddde2f740b8431ec",
            //     "companyName": "Razor",
            //     "application": {
            //         "bulletlead": {
            //             "isUser": false
            //         },
            //         "bulletform": {
            //             "formbuilder": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "entrymgmt": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "formmgmt": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "autofill": {
            //                 "delete": false,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "usermgmt": {
            //                 "delete": true,
            //                 "update": true,
            //                 "read": true,
            //                 "create": true
            //             },
            //             "usertype": "Admin",
            //             "isUser": true
            //         }
            //     },
            //     "__v": 0
            // }];
            // for (var i = 0; i < data.length; i++) {
            //     data[i].usertype = data[i].application.bulletform.usertype;
            // }
            //  vm.tableOptions.data = data;
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
                return feedbackServices.successFeedback('User Deleted', 'usermgmt-feedbackMessage', 2000);
            }

            function ErrorCallback(err) {
                deferred.reject(err);
                return feedbackServices.successFeedback(err.data, 'usermgmt-feedbackMessage', 2000);
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

            }

            function ErrorCallback(err) {
                deferred.reject(err);

            }
        }

        /**
         * Add one user to database. 
         * 
         * @param {object} userData
         */
        function createUser(userData) {
            var deferred = $q.defer();
            usermgmtServices.createUser(userData)
                .then(SuccessCallback)
                .catch(ErrorCallback);
            return deferred.promise;

            function SuccessCallback(res) {
                deferred.resolve();
            }

            function ErrorCallback(err) {
                deferred.reject(err);
            }
        }


        /**
         * Update one user on database. 
         * 
         * @param {object} userData
         */
        function updateUser(userData) {
            var deferred = $q.defer();
            usermgmtServices.updateUser(userData)
                .then(SuccessCallback)
                .catch(ErrorCallback);
            return deferred.promise;

            function SuccessCallback(res) {
                deferred.resolve();
            }

            function ErrorCallback(err) {
                deferred.reject(err);
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



        /* =========================================== API =========================================== */




    }
})();
