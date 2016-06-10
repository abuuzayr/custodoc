angular
    .module("user-interface")
    .controller("entriesCtrl", ['$scope', '$q', '$location', '$timeout', function ($scope, $q, $location, $timeout) {
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
        $scope.gridOptions = {}
        $scope.gridOptions.paginationPageSizes = [25, 50, 75];
        $scope.gridOptions.paginationPageSize = 25;
        $scope.gridOptions.enableHorizontalScrollbar = 0;
        $scope.gridOptions.enableVerticalScrollbar = 1;
        $scope.gridOptions.columnDefs = [{
            name: 'entryID',
            displayName: 'Entry ID'
            }, {
                name: 'submitDate',
                displayName: 'Submission Date',
                type: 'date',
            }, {
                name: 'formName',
                displayName: 'Form Name'
            }, {
                name: 'nameField',
                displayName: 'Name'
            }, {
                name: 'genderField',
                displayName: 'Gender'
            }, {
                name: 'nationalityField',
                displayName: 'Nationality',
            }, {
                name: 'emailField',
                displayName: 'Email',
            }];
        $scope.gridOptions.data = [
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN002",
                "submissionDate": "2016-05-03",
                "formName": "Sample Form B",
                "nameField": "Max",
                "genderField": "M",
                "nationalityField": "Chinese",
                "emailField": "maxpan@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            },
            {
                "entryID": "EN002",
                "submissionDate": "2016-05-03",
                "formName": "Sample Form B",
                "nameField": "Max",
                "genderField": "M",
                "nationalityField": "Chinese",
                "emailField": "maxpan@groventure.com"
            },
            {
                "entryID": "EN002",
                "submissionDate": "2016-05-03",
                "formName": "Sample Form B",
                "nameField": "Max",
                "genderField": "M",
                "nationalityField": "Chinese",
                "emailField": "maxpan@groventure.com"
            },
            {
                "entryID": "EN002",
                "submissionDate": "2016-05-03",
                "formName": "Sample Form B",
                "nameField": "Max",
                "genderField": "M",
                "nationalityField": "Chinese",
                "emailField": "maxpan@groventure.com"
            },
            {
                "entryID": "EN002",
                "submissionDate": "2016-05-03",
                "formName": "Sample Form B",
                "nameField": "Max",
                "genderField": "M",
                "nationalityField": "Chinese",
                "emailField": "maxpan@groventure.com"
            },
            {
                "entryID": "EN001",
                "submissionDate": "2016-05-01",
                "formName": "Sample Form A",
                "nameField": "Calvyn",
                "genderField": "M",
                "nationalityField": "Singaporean",
                "emailField": "calvyn@groventure.com"
            }
        ];
    }]);
