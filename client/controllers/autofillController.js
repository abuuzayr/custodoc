angular
    .module("app.core")
    .controller("autofillCtrl", ['$scope', '$q', '$location', '$timeout', function ($scope, $q, $location, $timeout) {
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

        /* =========================================== UI grid =========================================== */
        $scope.gridOptions = {}
        $scope.gridOptions.enableHorizontalScrollbar = 1;
        $scope.gridOptions.enableVerticalScrollbar = 1;
        $scope.gridOptions.columnDefs = [{
            name: 'name',
            displayName: 'Name'
        }, {
                name: 'gender',
                displayName: 'Gender',
            }, {
                name: 'dateOfBirth',
                displayName: 'Date of Birth',
            }, {
                name: 'nric',
                displayName: 'NRIC'
            }, {
                name: 'contact',
                displayName: 'Contact',
            }, {
                name: 'email',
                displayName: 'Email'
            }];

        /* =========================================== Data stubs =========================================== */
        $scope.gridOptions.data = [
            {
                "name": "Jay Chou",
                "gender": "M",
                "dateOfBirth": "13/05/1980",
                "nric": "S1234567A",
                "contact": "98765432",
                "email": "jay@gmail.com",
            },
            {
                "name": "Jay Chou",
                "gender": "M",
                "dateOfBirth": "13/05/1980",
                "nric": "S1234567A",
                "contact": "98765432",
                "email": "jay@gmail.com",
            },
            {
                "name": "Jay Chou",
                "gender": "M",
                "dateOfBirth": "13/05/1980",
                "nric": "S1234567A",
                "contact": "98765432",
                "email": "jay@gmail.com",
            }
        ];
    }]);
