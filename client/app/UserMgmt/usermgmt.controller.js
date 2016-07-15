angular
    .module("app.core")
    .controller("usersCtrl", ['$scope', '$q', '$location', '$timeout', 'dialogServices', function ($scope, $q, $location, $timeout, dialogServices) {
        var vm = this;
        var addUserId = 0;
        vm.users = [];
        vm.userGroups = ["Admin", "User+", "User"];

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
            } else {
                console.log('Add user unsuccessful');
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
                // feedbackServices.successFeedback('Edited successfully', '#newUser-feedbackMessage');
            } else {
                console.log('edituser PHAIL');
                // feedbackServices.errorFeedback('Invalid form submission', '#newUser-feedbackMessage');
            }
        }

        function removeUser(username) {
            // TODO: delete user, remember add pop up
            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].username === username) {
                    vm.users.splice(i, 1);
                }
            }
            addAppId--; 
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
    }]);
