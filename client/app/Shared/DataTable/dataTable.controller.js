(function() {
    "use strict";
    angular.module('dataTable')
        .controller('dataTableController', dataTableController);

    dataTableController.$inject = ['$scope', '$timeout', '$q', '$filter', 'feedbackServices', 'dialogServices'];

    function dataTableController($scope, $timeout, $q, $filter, feedbackServices, dialogServices) {
        //VARIABLES
        var isDataLoaded = false;
        var idLookup = {};
        //$SCOPE FUNCTIONS
        $scope.sort = sort;
        $scope.getTimes = getTimes;
        $scope.selectOne = selectOne;
        $scope.deselectAll = deselectAll;
        $scope.filterActionCol = filterActionCol;
        $scope.filterTextCol = filterTextCol;
        $scope.validateCSVBeforeUpload = validateCSVBeforeUpload;
        //data watcher, watching for data loading, initiate scope after data is loaded
        $scope.$watch('tableOptions.data', dataWatcher, true);

        function dataWatcher(newVal, oldVal) {
            if (newVal !== null && newVal !== 'undefined' && newVal.length !== 0 && newVal.length !== oldVal.length) {
                isDataLoaded = true;
                initScope();
                idLookup = {};
                for (var i = 0, len = $scope.tableOptions.data.length; i < len; i++) {
                    idLookup[$scope.tableOptions.data[i]._id] = $scope.tableOptions.data[i];
                }
                angular.element(document.querySelector('#table-progress')).removeClass('mdl-progress__indeterminate');
            }
        }

        //functions to initialize $scope and tableOptions
        function initScope() {
            constructTableOptions();
            includeMethod($scope.tableOptions);
        }

        function constructTableOptions() {
            $scope.tableOptions.selection = {
                checked: {},
                selectedId: [],
                selected: []
            };
            $scope.tableOptions.exportOptions = {
                exportBy: ['Selected', 'All'],
                exclude: []
            };
            $scope.tableOptions.importOptions = {
                allowedExtension: '.csv',
                maxSize: 10
            };
            $scope.tableOptions.filterQuery = '';
            $scope.tableOptions.csvUpload = null;
            //SET DEFAULT VALUES
            if (typeof $scope.tableOptions.enablePagination === 'undefined' || $scope.tableOptions.enablePagination === null)
                $scope.tableOptions.enablePagination = false;
            if (typeof $scope.tableOptions.enableMultiSelect === 'undefined' || $scope.tableOptions.enableMultiSelect === null)
                $scope.tableOptions.enableMultiSelect = true;
            if (typeof $scope.tableOptions.enableDelete === 'undefined' || $scope.tableOptions.enableDelete === null)
                $scope.tableOptions.enableDelete = true;
            if (typeof $scope.tableOptions.enableEdit === 'undefined' || $scope.tableOptions.enableEdit === null)
                $scope.tableOptions.enableEdit = false;
            if (typeof $scope.tableOptions.enableExport === 'undefined' || $scope.tableOptions.enableExport === null)
                $scope.tableOptions.enableExport = false;
            if (typeof $scope.tableOptions.enableImport === 'undefined' || $scope.tableOptions.enableImport === null)
                $scope.tableOptions.enableImport = false;
            if (typeof $scope.tableOptions.enableSearch === 'undefined' || $scope.tableOptions.enableSearch === null)
                $scope.tableOptions.enableSearch = true;
            //Generate Options Based On Enabled Properties
            setPagination($scope.tableOptions.enablePagination);
        }

        function includeMethod(tableOptions) {
            $scope.sorting = {
                sortBy: $scope.tableOptions.columnDefs[0].fieldName ? $scope.tableOptions.columnDefs[0].fieldName : null,
                sortReverse: false
            };

            if ($scope.tableOptions.enablePagination) {
                $scope.toFirstPage = toFirstPage;
                $scope.toLastPage = toLastPage;
                $scope.toNextPage = toNextPage;
                $scope.toPreviousPage = toPreviousPage;
            }
            if ($scope.tableOptions.enableMultiSelect) {
                $scope.selectVisible = selectVisible;
            }
            if ($scope.tableOptions.enableMultiSelection) {

            }
            if ($scope.tableOptions.enableEdit) {
                $scope.editRow = editRow;
                $scope.discardEdit = discardEdit;
                $scope.saveEdit = saveEdit;
            }
            if ($scope.tableOptions.enableDelete) {
                $scope.deleteSelected = deleteSelected;
            }
            if ($scope.tableOptions.enableExport) {
                $scope.exportCSV = exportCSV;
            }
            if ($scope.tableOptions.enableImport) {
                $scope.validateCSVBeforeUpload = validateCSVBeforeUpload;
            }
            if ($scope.tableOptions.enableSearch) {
                $scope.filterByKeyword = filterByKeyword;
            }
        }


        function setPagination(isEnabled) {
            $scope.tableOptions.pagination = {};
            if (isEnabled) {
                $scope.tableOptions.pagination.itemPerPage = $scope.dtRowPerPage;
                $scope.tableOptions.pagination.limitOptions = $scope.dtRowPerPageOptions;
                if (typeof $scope.tableOptions.pagination.limitOptions === 'undefined' || $scope.tableOptions.pagination.limitOptions.constructor !== Array || $scope.tableOptions.pagination.limitOptions.length === 0)
                    $scope.tableOptions.pagination.limitOptions = [10, 20, 30];
                if (typeof $scope.tableOptions.pagination.itemPerPage === 'undefined' || $scope.tableOptions.pagination.itemPerPage.constructor !== Number || $scope.tableOptions.pagination.itemPerPage < 1)
                    $scope.tableOptions.pagination.itemPerPage = $scope.tableOptions.pagination.limitOptions[0];
                $scope.tableOptions.pagination.totalItem = $scope.tableOptions.data.length;
                $scope.tableOptions.pagination.totalPage = Math.ceil($scope.tableOptions.pagination.totalItem / $scope.tableOptions.pagination.itemPerPage);
                $scope.tableOptions.pagination.rgPage = getTimes($scope.tableOptions.pagination.totalPage);
                $scope.tableOptions.pagination.currentPage = 1;
            } else {
                $scope.tableOptions.pagination.totalItem = $scope.tableOptions.data.length;
                $scope.tableOptions.pagination.itemPerPage = $scope.tableOptions.pagination.totalItem;
                $scope.tableOptions.pagination.totalPage = 1;
            }
        }

        //page change watchers
        $scope.$watch('tableOptions.pagination.currentPage', function onPageChange(newPage, oldPage) {
            if (isDataLoaded) {
                $scope.tableOptions.pagination.startingIndex = (newPage - 1) * $scope.tableOptions.pagination.itemPerPage + 1 < $scope.tableOptions.pagination.totalItem ? (newPage - 1) * $scope.tableOptions.pagination.itemPerPage : $scope.tableOptions.pagination.totalItem;
                renderSelectionOnChange();
                renderToggleOnChange();
            }
        });

        $scope.$watch('tableOptions.pagination.itemPerPage', function onItemPerPageChange(newLimit, oldLimit) {
            if (isDataLoaded) {
                $scope.tableOptions.pagination.itemPerPage = newLimit;
                $scope.tableOptions.pagination.totalPage = Math.ceil($scope.tableOptions.pagination.totalItem / $scope.tableOptions.pagination.itemPerPage);
                $scope.tableOptions.pagination.rgPage = getTimes($scope.tableOptions.pagination.totalPage);
                renderSelectionOnChange();
            }
        });

        //page navigation
        function toFirstPage() {
            $scope.tableOptions.pagination.currentPage = 1;
        }

        function toLastPage() {
            $scope.tableOptions.pagination.currentPage = $scope.tableOptions.pagination.totalPage;
        }

        function toNextPage() {
            if ($scope.tableOptions.pagination.currentPage < $scope.tableOptions.pagination.totalPage)
                $scope.tableOptions.pagination.currentPage++;
            else
                feedbackServices.errorFeedback('Last page', 'dataTable-feedbackMessage');
        }

        function toPreviousPage() {
            if ($scope.tableOptions.pagination.currentPage > 1)
                $scope.tableOptions.pagination.currentPage--;
            else
                return feedbackServices.errorFeedback('First page', 'dataTable-feedbackMessage');
        }

        //functions to handle selection
        function selectVisible($event) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            var elementList = angular.element(document.querySelectorAll("[id^='data-table-checkbox-label-']"));
            var elementId = '';
            for (var i = 0; i < elementList.length; i++) {
                elementId = elementList[i].id.replace('data-table-checkbox-label-', '');
                if (action === 'add' && $scope.tableOptions.selection.selectedId.indexOf(elementId) === -1) {
                    updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-', ''));
                } else if (action === 'remove' && $scope.tableOptions.selection.selectedId.indexOf(elementId) != -1) {
                    updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-', ''));
                }
            }
            renderSelectionOnChange();
        }

        function selectOne($event, row) {
            if (!$scope.tableOptions.enableMultiSelect)
                deselectAll();
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelection(checkbox, action, row._id);
            renderSelectionOnChange();
        }

        function deselectAll() {
            $scope.tableOptions.selection.checked = { headerChecked: false };
            $scope.tableOptions.selection.selectedId = [];
            $scope.tableOptions.selection.selected = [];
            renderSelectionOnChange();
        }

        function updateSelection(target, action, id) {
            return action === 'add' ? addToSelection(target, id) : removeFromSelection(target, id);

            function addToSelection(target, id) {
                if ($scope.tableOptions.selection.selectedId.indexOf(id) === -1) {
                    $scope.tableOptions.selection.selectedId.push(id);
                    if (target && (!$scope.tableOptions.selection.checked.hasOwnProperty(id) || (!$scope.tableOptions.selection.checked[id] && !$scope.tableOptions.selection.checked.hasOwnProperty(id))))
                        target.checked = true;
                }
            }

            function removeFromSelection(target, id) {
                if ($scope.tableOptions.selection.selectedId.indexOf(id) !== -1) {
                    $scope.tableOptions.selection.selectedId.splice($scope.tableOptions.selection.selectedId.indexOf(id), 1);
                    if (target && (!$scope.tableOptions.selection.checked.hasOwnProperty(id) || $scope.tableOptions.selection.checked[id]))
                        target.checked = false;
                }
            }
        }

        function renderSelectionOnChange() {
            $timeout(function() {
                var headerCheckbox = angular.element(document.querySelectorAll("[id^='data-table-header-checkbox-label']"))[0];
                var elementList = angular.element(document.querySelectorAll("[id^='data-table-checkbox-label-']"));
                var elementId = '';
                for (var i = 0; i < elementList.length; i++) {

                    elementId = elementList[i].id.replace('data-table-checkbox-label-', '');
                    if ($scope.tableOptions.selection.selectedId.indexOf(elementId) === -1 && angular.element(elementList[i]).hasClass('is-checked')) {
                        elementList[i].MaterialCheckbox.uncheck();
                    } else if ($scope.tableOptions.selection.selectedId.indexOf(elementId) !== -1 && !angular.element(elementList[i]).hasClass('is-checked')) {
                        elementList[i].MaterialCheckbox.check();
                    }
                }
                //header
                if ($scope.tableOptions.enableMultiSelect && elementList && elementList.length > 0) {
                    if (isAllChecked(elementList)) {
                        $scope.tableOptions.selection.checked.headerChecked = true;
                        headerCheckbox.MaterialCheckbox.check();
                    } else {
                        $scope.tableOptions.selection.checked.headerChecked = false;
                        headerCheckbox.MaterialCheckbox.uncheck();
                    }
                }
            }, 0, false);
        }

        function isAllChecked(elementList) {
            for (var i = 0; i < elementList.length; i++) {
                if (!angular.element(elementList[i]).hasClass('is-checked')) {

                    return false;
                }
            }

            return true;
        }

        function getDataFromId() {
            for (var index = 0, length = $scope.tableOptions.selection.selectedId.length; index < length; index++) {
                $scope.tableOptions.selection.selected.push(idLookup[$scope.tableOptions.selection.selectedId[index]]);
            }
        }

        //SORTING AND FILTERING
        function sort(col) {
            $scope.sorting.sortBy = col.fieldName;
            $scope.sorting.sortReverse = !$scope.sorting.sortReverse;
            if (col.type === 'default')
                $scope.tableOptions.data = $filter('orderBy')($scope.tableOptions.data, $scope.sorting.sortBy, $scope.sorting.sortReverse);
            else
                $scope.tableOptions.data = $filter('orderBy')($scope.tableOptions.data, $scope.sorting.sortBy, $scope.sorting.sortReverse);
            renderSelectionOnChange();
        }

        function filterByKeyword(element) {
            if ($scope.tableOptions.filterQuery === 'undefined' || !$scope.tableOptions.filterQuery) {
                return true;
            }
            for (var property in element) {
                for (var i = 0; i < $scope.tableOptions.columnDefs.length; i++) {
                    if ($scope.tableOptions.columnDefs[i].fieldName === property) {
                        if (element.hasOwnProperty(property)) {
                            if (typeof element[property] === 'string') {
                                if (element[property].toLowerCase().indexOf($scope.tableOptions.filterQuery.toLowerCase()) != -1) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }

        function filterActionCol(element) {
            if (element.hasOwnProperty('type') && element.type === 'action')
                return true;
            else
                return false;
        }

        function filterTextCol(element) {
            if (!element.hasOwnProperty('type') || element.type === 'default' || element.type === 'date' || element.type === 'link' || element.type === 'toggle')
                return true;
            else
                return false;
        }

        $scope.$watch('tableOptions.filterQuery', function(newVal, oldVal) {
            renderSelectionOnChange();
        });

        //IMPORT AND EXPORT
        function exportCSV(exportBy) {
            if (exportBy === 'Selected')
                return exportSelected();
            else if (exportBy === 'All')
                return exportAll();
            else
                return feedbackServices.errorFeedback('Please select a valid export option', 'dataTable-feedbackMessage');
        }

        function exportSelected() {
            getDataFromId();
            if ($scope.tableOptions.selection.selected == [] || $scope.tableOptions.selection.selected.length < 1)
                return feedbackServices.errorFeedback('Please select at least one row', 'dataTable-feedbackMessage');
            else {
                var exportData = [];
                for (var i = 0; i < $scope.tableOptions.selection.selected.length; i++) {
                    var tempObject = {};
                    for (var j = 0; j < $scope.tableOptions.columnDefs.length; j++) {
                        if ($scope.tableOptions.columnDefs[j].type !== 'action')
                            tempObject[$scope.tableOptions.columnDefs[j].fieldName] = $scope.tableOptions.selection.selected[i][$scope.tableOptions.columnDefs[j].fieldName];
                    }
                    exportData.push(tempObject);
                }
                return download(Papa.unparse(exportData));
            }

        }

        function exportAll() {
            var exportData = [];
            for (var i = 0; i < $scope.tableOptions.data.length; i++) {
                var tempObject = {};
                for (var j = 0; j < $scope.tableOptions.columnDefs.length; j++) {
                    if ($scope.tableOptions.columnDefs[j].type !== 'action')
                        tempObject[$scope.tableOptions.columnDefs[j].fieldName] = $scope.tableOptions.data[i][$scope.tableOptions.columnDefs[j].fieldName];
                }
                exportData.push(tempObject);
            }
            return download(Papa.unparse(exportData));
        }

        function download(csv) {
            var blob = new Blob([csv], { tpye: 'text/csv;charset=utf-8;' });
            var uagent = navigator.userAgent.toLowerCase();
            if (/safari/.test(uagent) && !/chrome/.test(uagent))
                window.open('data:attachment/csv;charset=utf-8,' + encodeURI(csv));
            else if (window.navigator.msSaveOrOpenBlob)
                window.navigator.msSaveBlob(blob, "download.csv");
            else {
                var link = window.document.createElement('a');
                link.setAttribute('target', "_self");
                link.setAttribute('href', window.URL.createObjectURL(blob));
                link.setAttribute('download', 'download.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        function validateCSVBeforeUpload() {
            var file = event.target.files[0];
            console.log(event.target);
            if (file.name) {
                if (file.name.substr(file.name.lastIndexOf('.') + 1) === 'csv') {
                    if (file.size > $scope.tableOptions.importOptions.maxSize * 1000000)
                        return feedbackServices.errorFeedback('Max size allowed is ' + $scope.tableOptions.importOptions.maxSize + ' MB', 'dataTable-feedbackMessage');
                    else
                        return getFileContent(event, file);
                } else
                    return feedbackServices.errorFeedback('Please choose .csv file', 'dataTable-feedbackMessage');
            }
        }

        function getFileContent(event, file) {
            if (window.FileReader) {
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = loadHandler;
                reader.onerror = errorHandler;
            } else {
                console.log('not supported');
            }

            function loadHandler(event) {
                csvToArray(event.target.result);
            }

            function errorHandler(evt) {
                if (evt.target.error.name == "NotReadableError") {
                    feedbackServices.errorFeedback("Canno't read file !", 'dataTable-feedbackMessage');
                }
            }

            function csvToArray(csv) {
                var lines = csv.split(/\r\n|\n/);
                var rowArray = [];
                var headerArray = [];
                for (var i = 0; i < lines.length; i++) {
                    var tempObject = {};
                    var line = lines[i].split(',');
                    if (i === 0) {
                        headerArray = line;
                    } else {
                        for (var j = 0; j < headerArray.length; j++) {
                            tempObject[headerArray[j]] = line[j];
                        }
                        rowArray.push(tempObject);
                    }
                }
                updateTable(rowArray).then(function successCallback(result) {
                    feedbackServices.successFeedback('Records imported', 'dataTable-feedbackMessage');
                }, function errorCallback(reason) {
                    feedbackServices.errorFeedback('Import error', 'dataTable-feedbackMessage');
                });
            }

            function updateTable(objectArray) {
                return $scope.tableOptions.importFunc(objectArray);
            }

        }

        //ROW EDIT
        function editRow(row) {
            openDialog();
            $scope.rowInEdit = row;
            angular.element(document.querySelector('#data-table-row-' + $scope.rowInEdit._id)).addClass('row-in-edit');
        }

        function discardEdit() {
            angular.element(document.querySelector('#data-table-row-' + $scope.rowInEdit._id)).removeClass('row-in-edit');
            closeDialog();
            $scope.rowInEdit = null;
        }

        function deleteSelected() {
            $scope.tableOptions.deleteFunc($scope.tableOptions.selection.selectedId)
                .then(function successCallback() {
                    if ($scope.tableOptions.selection.selectedId.length === 0) {
                        $timeout(function() {
                            renderSelectionOnChange();
                        }, 500);
                    }
                });
        }

        function saveEdit() {
            angular.element(document.querySelector('#table-progress')).addClass('mdl-progress__indeterminate');
            angular.element(document.querySelector('#data-table-row-' + $scope.rowInEdit._id)).removeClass('row-in-edit');
            return $scope.tableOptions.saveFunc($scope.rowInEdit)
                .then(resolve, reject);

            function resolve(msg) {
                angular.element(document.querySelector('#table-progress')).removeClass('mdl-progress__indeterminate');
                closeDialog();
            }

            function reject(err) {
                angular.element(document.querySelector('#table-progress')).removeClass('mdl-progress__indeterminate');
                feedbackServices.errorFeedback(err.description, 'dataTable-feedbackMessage');
            }
        }

        function openDialog() {
            dialogServices.openDialog('table-edit-dialog');
        }

        function closeDialog() {
            dialogServices.closeDialog('table-edit-dialog');
        }
        //HELPER FUNCTION
        function getTimes(number) {
            console.log(number);
            return new Array(number);
        }


        //function for external use
        var viewContentLoaded = $q.defer();
        $scope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                getPagination();
                viewContentLoaded.resolve();
            }, 0);
        });
        viewContentLoaded.promise.then(function() {
            $timeout(function() {
                componentHandler.upgradeDom();
            }, 0);
        });
    }
})();
