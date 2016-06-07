angular
    .module("user-interface")
    .controller("formsCtrl", ["$scope", function ($scope) {
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
        $scope.forms = [
            {
                formName: 'Sample Form A'
            },
            {
                formName: 'Form B qwerty plusplussuperlongname'
            },
            {
                formName: 'Form C'
            },
            {
                formName: 'Form D'
            },
            {
                formName: 'Form E'
            },
            {
                formName: 'Form F'
            }

        ];
        $scope.openDialog = function() {
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
            dialog.showModal();
        };
        $scope.closeDialog = function() {
            dialog.close();
        };
    }]);
