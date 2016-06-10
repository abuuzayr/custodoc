angular
    .module("user-interface")
    .controller("formsCtrl", ['$scope', '$q', '$location', '$timeout', function ($scope, $q, $location, $timeout) {
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
        $scope.gridOptions.enableHorizontalScrollbar = 0;
        $scope.gridOptions.enableVerticalScrollbar = 0;
        $scope.gridOptions.columnDefs = [{
            name: 'formName',
            displayName: 'Form Name'
            },
            {
                name: 'isImportant',
                displayName: 'Important',
                cellTemplate: '<input type="checkbox" ng-model="row.entity.isImportant">'
            },
            {
                name: 'creationDate',
                displayName: 'Creation Date',
                type: 'date',
            }, {
                name: 'creatorName',
                displayName: 'Creator'
            }, {
                name: 'lastRecord',
                displayName: 'Last Record',
                type: 'date'
            }, {
                name: 'lastModifiedDate',
                displayName: 'Last Modified'
            }, {
                name: 'lastModifiedName',
                displayName: 'Last Modified By',
            }];

        $scope.gridOptions.data = [
            {
                "formName": "Sample Form A",
                "creationDate": "13/05/2016",
                "creatorName": "Calvyn",
                "lastRecord": "13/05/2016",
                "lastModifiedDate": "13/05/2016",
                "lastModifiedName": "Calvyn",
                "isImportant": false
            },
            {
                "formName": "Sample Form B",
                "creationDate": "15/05/2016",
                "creatorName": "Angie",
                "lastRecord": "15/05/2016",
                "lastModifiedDate": "15/05/2016",
                "lastModifiedName": "Angie",
                "isImportant": false
            },
            {
                "formName": "Sample Form C",
                "creationDate": "13/05/2016",
                "creatorName": "Linghan",
                "lastRecord": "13/05/2016",
                "lastModifiedDate": "14/05/2016",
                "lastModifiedName": "Calvyn",
                "isImportant": true
            }
        ];
        $scope.formNames = [
            {
                name: 'Sample Form A'
            },
            {
                name: 'Form B'
            },
            {
                name: 'Form C'
            },
            {
                name: 'Form D'
            },
            {
                name: 'Form E'
            },
            {
                name: 'Form F'
            }

        ];
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
        };
    }]);
