(function() {
	"use strict";  
angular.module('dataTable')
	.controller('dataTableController',dataTableController);

	dataTableController.$inject = ['$scope','$timeout','$q','feedbackServices','dialogServices'];
	function dataTableController($scope,$timeout,$q,feedbackServices,dialogServices){
		//VARIABLES
		var isDataLoaded = false;
		//$SCOPE FUNCTIONS
		$scope.sort = sort;
		$scope.getTimes = getTimes;
		$scope.selectOne = selectOne;
		$scope.deselectAll = deselectAll;
		$scope.filterActionCol = filterActionCol;
		$scope.filterDefaultCol = filterDefaultCol; 

		//data watcher, watching for data loading, initiate scope after data is loaded
		$scope.$watch('tableOptions.data', dataWatcher, true);
		function dataWatcher(newVal,oldVal){
			console.log('watching',newVal.length,oldVal.length);
			if(newVal !== null && newVal !== 'undefined' && newVal.length !== 0){
				isDataLoaded = true;
				initScope();
				angular.element(document.querySelector('#table-progress')).removeClass('mdl-progress__indeterminate');
			}
		}
		
		//functions to initialize $scope and tableOptions
		function initScope(){
			constructTableOptions();
			includeMethod($scope.tableOptions);
		}

		function constructTableOptions(){
			$scope.tableOptions.selection = {
				checked: {},
				selectedId: [],
				selected: []
			};
			$scope.tableOptions.exportOptions = {
				exportBy:['Selected','All'],
				exclude:[]
			};
			$scope.tableOptions.importOptions = {
				allowedExtension: '.csv',
				maxSize: '20'
			};
			//SET DEFAULT VALUES
			if(typeof $scope.tableOptions.enablePagination === 'undefined' || $scope.tableOptions.enablePagination === null)
				$scope.tableOptions.enablePagination = false;
			if(typeof $scope.tableOptions.enableMultiSelect === 'undefined' || $scope.tableOptions.enableMultiSelect === null)
				$scope.tableOptions.enableMultiSelect = true;
			if(typeof $scope.tableOptions.enableDelete === 'undefined' || $scope.tableOptions.enableDelete === null)
				$scope.tableOptions.enableDelete = true;
			if(typeof $scope.tableOptions.enableEdit === 'undefined' || $scope.tableOptions.enableEdit === null)
				$scope.tableOptions.enableEdit = false;
			if(typeof $scope.tableOptions.enableExport === 'undefined' || $scope.tableOptions.enableExport === null)
				$scope.tableOptions.enableExport = false;
			if(typeof $scope.tableOptions.enableImport === 'undefined' || $scope.tableOptions.enableImport === null)
				$scope.tableOptions.enableImport = false;
			//Generate Options Based On Enabled Properties
			setPagination($scope.tableOptions.enablePagination);
		}

		function includeMethod(tableOptions){
			$scope.sorting = {
				sortBy: $scope.tableOptions.columnDefs[0].fieldName ? $scope.tableOptions.columnDefs[0].fieldName : null,
				sortReverse: false
			};

			if(tableOptions.enablePagination){
				$scope.toFirstPage = toFirstPage;
				$scope.toLastPage = toLastPage;
				$scope.toNextPage = toNextPage;
				$scope.toPreviousPage = toPreviousPage;
			}
			if(tableOptions.enableMultiSelect){
				$scope.selectVisible = selectVisible;
			}
			if(tableOptions.enableMultiSelection){

			}
			if(tableOptions.enableEdit){
				$scope.editRow = editRow;
				$scope.discardEdit = discardEdit;
				$scope.saveEdit = saveEdit;
			}
			if(tableOptions.enableDelete){
				$scope.deleteSelected = deleteSelected;
			}
			if(tableOptions.enableExport){
				$scope.exportCSV = exportCSV;
			}
			if(tableOptions.enableImport){
			}
			if(tableOptions.enableSearch){
				$scope.filterByKeyword = filterByKeyword;
			}
		}

		function setPagination(isEnabled){
			$scope.tableOptions.pagination = {};
			if(isEnabled){
				$scope.tableOptions.pagination.itemPerPage = $scope.dtRowPerPage;
				$scope.tableOptions.pagination.limitOptions = $scope.dtRowPerPageOptions;
				if($scope.tableOptions.pagination.limitOptions.constructor !== Array || $scope.tableOptions.pagination.limitOptions.length === 0)
					$scope.tableOptions.pagination.limitOptions = [10,20,30];
				if(typeof $scope.tableOptions.pagination.itemPerPage === 'undefined' || $scope.tableOptions.pagination.itemPerPage.constructor !== Number || $scope.tableOptions.pagination.itemPerPage < 1)
					$scope.tableOptions.pagination.itemPerPage = $scope.tableOptions.pagination.limitOptions[0];
				$scope.tableOptions.pagination.totalItem = $scope.tableOptions.data.length;
				$scope.tableOptions.pagination.totalPage = Math.ceil($scope.tableOptions.pagination.totalItem/$scope.tableOptions.pagination.itemPerPage);
				$scope.tableOptions.pagination.rgPage = getTimes($scope.tableOptions.pagination.totalPage);
				$scope.tableOptions.pagination.currentPage = 1;
			}else{
				$scope.tableOptions.pagination.totalItem = $scope.tableOptions.data.length;
				$scope.tableOptions.pagination.itemPerPage = $scope.tableOptions.pagination.totalItem;
				$scope.tableOptions.pagination.totalPage = 1;
			}	
		}

		//page change watchers
	 	$scope.$watch('tableOptions.pagination.currentPage',function onPageChange(newPage, oldPage){
	 		if(isDataLoaded){
				$scope.tableOptions.pagination.startingIndex = (newPage - 1) * $scope.tableOptions.pagination.itemPerPage + 1 < $scope.tableOptions.pagination.totalItem ? (newPage - 1) * $scope.tableOptions.pagination.itemPerPage : $scope.tableOptions.pagination.totalItem;
				renderSelectionOnChange();
	 		}
	 	});

	 	$scope.$watch('tableOptions.pagination.itemPerPage',function onItemPerPageChange(newLimit, oldLimit){
	 		if(isDataLoaded){
				$scope.tableOptions.pagination.itemPerPage = newLimit;
				$scope.tableOptions.pagination.totalPage = Math.ceil($scope.tableOptions.pagination.totalItem/$scope.tableOptions.pagination.itemPerPage);
				$scope.tableOptions.pagination.rgPage = getTimes($scope.tableOptions.pagination.totalPage);
				renderSelectionOnChange();
			}
	 	});

	 	//page navigation
	 	function toFirstPage(){
	 		$scope.tableOptions.pagination.currentPage = 1;
	 	}

	 	function toLastPage(){
	 		$scope.tableOptions.pagination.currentPage = $scope.tableOptions.pagination.totalPage;
	 	}

	 	function toNextPage(){
	 		if($scope.tableOptions.pagination.currentPage < $scope.tableOptions.pagination.totalPage)
	 			$scope.tableOptions.pagination.currentPage++;
	 		else
	 			feedbackServices.errorFeedback('Last page', 'dataTable-feedbackMessage');
	 	}

	 	function toPreviousPage(){
	 		if($scope.tableOptions.pagination.currentPage > 1)
	 			$scope.tableOptions.pagination.currentPage--;
	 		else
	 			return feedbackServices.errorFeedback('First page', 'dataTable-feedbackMessage');
	 	}

	 	//functions to handle selection
	 	function selectVisible($event){
	 		var checkbox = $event.target;
	  		var action = (checkbox.checked ? 'add' : 'remove');
	  		var elementList = angular.element( document.querySelectorAll( "[id^='data-table-checkbox-label-']") );
	  		var elementId = '';
	  		for ( var i = 0; i < elementList.length; i++) {
	  			elementId = elementList[i].id.replace('data-table-checkbox-label-','');
	  			if(action==='add' && $scope.tableOptions.selection.selectedId.indexOf(elementId) === -1){
	  				updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-',''));
	  			}else if(action==='remove' && $scope.tableOptions.selection.selectedId.indexOf(elementId) != -1){
	  				updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-',''));
	  			}
	  		}
	  		renderSelectionOnChange();
	 	}

	 	function selectOne($event, row){
	 		var checkbox = $event.target;
	  		var action = (checkbox.checked ? 'add' : 'remove');
	  		updateSelection(checkbox, action, row._id);
	  		renderSelectionOnChange();
	 	}

	 	function deselectAll(){
	 		$scope.tableOptions.selection.checked = { headerChecked:false };
	 		$scope.tableOptions.selection.selectedId = [];
	 		$scope.tableOptions.selection.selected = [];
	 		renderSelectionOnChange();
	 	}

	 	function updateSelection(target, action , id){
			return action === 'add' ? addToSelection(target, id) : removeFromSelection(target,id);

			function addToSelection(target, id){
				if($scope.tableOptions.selection.selectedId.indexOf(id) === -1){
					$scope.tableOptions.selection.selectedId.push(id);
					if(target && (!$scope.tableOptions.selection.checked.hasOwnProperty(id) || (!$scope.tableOptions.selection.checked[id] && !$scope.tableOptions.selection.checked.hasOwnProperty(id))))
						target.checked = true;
				}
			}

			function removeFromSelection(target,id){
				if($scope.tableOptions.selection.selectedId.indexOf(id) !== -1){
					$scope.tableOptions.selection.selectedId.splice($scope.tableOptions.selection.selectedId.indexOf(id), 1);
					if(target && (!$scope.tableOptions.selection.checked.hasOwnProperty(id) || $scope.tableOptions.selection.checked[id]))
						target.checked = false;
				}
			}
	 	}

	 	function renderSelectionOnChange(){
			$timeout( function() {
				var headerCheckbox = angular.element(document.querySelectorAll("[id^='data-table-header-checkbox-label']"))[0];
				var elementList = angular.element(document.querySelectorAll("[id^='data-table-checkbox-label-']"));
				var elementId = '';
				for(var i = 0 ; i < elementList.length; i++){
					
					elementId = elementList[i].id.replace('data-table-checkbox-label-','');
					if( $scope.tableOptions.selection.selectedId.indexOf(elementId) === -1 && angular.element(elementList[i]).hasClass('is-checked') ){
						elementList[i].MaterialCheckbox.uncheck();
					}else if($scope.tableOptions.selection.selectedId.indexOf(elementId) !== -1 && !angular.element(elementList[i]).hasClass('is-checked')){
						elementList[i].MaterialCheckbox.check();
					}
				}
				//header
				if(elementList && elementList.length > 0 ){
					if(isAllChecked(elementList)){
							$scope.tableOptions.selection.checked.headerChecked = true;
							headerCheckbox.MaterialCheckbox.check();
					}else{
							$scope.tableOptions.selection.checked.headerChecked = false;
							headerCheckbox.MaterialCheckbox.uncheck();
					}
				}
	  		}, 0, false);
	 	}

	 	function isAllChecked(elementList){
	 		for(var i = 0 ; i < elementList.length; i++){
	 			if(!angular.element(elementList[i]).hasClass('is-checked')){

	 				return false;
	 			}	
	 		}

	 		return true;
	 	}

	 	function getDataFromId(){
	 		var lookup = {};
			for( var i = 0, len = $scope.tableOptions.data.length; i < len; i++) {
	    		lookup[$scope.tableOptions.data[i]._id] = $scope.tableOptions.data[i];
			}
			for( var index = 0, length = $scope.tableOptions.selection.selectedId.length; index < length; index++){
				$scope.tableOptions.selection.selected.push(lookup[$scope.tableOptions.selection.selectedId[index]]);
			}
		}

		//SORTING AND FILTERING
		function sort(col){
	 		$scope.sorting.sortBy = col.fieldName;
			$scope.sorting.sortReverse = !$scope.sorting.sortReverse;
			renderSelectionOnChange();
	 	}

	 	function filterByKeyword(element) {
			if($scope.tableOptions.filterQuery === 'undefined' || !$scope.tableOptions.filterQuery){
				return true;
			}
            for (var property in element) {
                for (var i=0; i < $scope.tableOptions.columnDefs.length; i++) {
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

        function filterActionCol(element){
        	if(element.hasOwnProperty('type') && element.type === 'action')
        		return true;
        	else
        		return false;
        }

        function filterDefaultCol(element){
        	if(!element.hasOwnProperty('type') || element.type === 'default')
        		return true;
        	else
        		return false;
        }

        $scope.$watch('table.filterQuery', function() {
     		renderSelectionOnChange();
		});

	 	//IMPORT AND EXPORT
	 	function exportCSV(exportBy){
			if( exportBy === 'Selected')
				return exportSelected();
			else if( exportBy === 'All')
				return exportAll();
			else 
				return feedbackServices.errorFeedback('Please select a valid export option','dataTable-feedbackMessage');
		}

		function exportSelected(){
			getDataFromId();
			if($scope.tableOptions.selection.selected == [] || $scope.tableOptions.selection.selected.length < 1)
				return feedbackServices.errorFeedback('Please select at least one row','dataTable-feedbackMessage'); 
			else	
				return download(Papa.unparse($scope.tableOptions.selection.selected));
		}

		function exportAll(){
			var csv = Papa.unparse($scope.tableOptions.data);
			return download(csv);
		}

		function download(csv){
			var blob =  new Blob([csv],{tpye:'text/csv;charset=utf-8;'});
			var uagent = navigator.userAgent.toLowerCase();
			if(/safari/.test(uagent) && !/chrome/.test(uagent))
				window.open('data:attachment/csv;charset=utf-8,' + encodeURI(csv));
			else if (window.navigator.msSaveOrOpenBlob)
				window.navigator.msSaveBlob(blob, "download.csv");
			else{
				var link = window.document.createElement('a');
				link.setAttribute('target',"_self");
				link.setAttribute('href',window.URL.createObjectURL(blob));
				link.setAttribute('download','download.csv');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}

		//ROW EDIT
		function editRow(row){
			openDialog();
			$scope.rowInEdit = row;
		}

		function discardEdit(){
			closeDialog();
			$scope.rowInEdit = null;
		}

		function deleteSelected(){
			$scope.tableOptions.delete($scope.tableOptions.selection.selectedId)
			.then(function successCallback(){
				if($scope.tableOptions.selection.selectedId.length === 0){
					$timeout(function() {
						renderSelectionOnChange();
					}, 500);
				}
			});
		}

		function saveEdit(){
			return $scope.tableOptions.dataServices.save($scope.rowInEdit);
		}
                   		
		function openDialog(){
			dialogServices.openDialog('table-edit-dialog');
		}
		function closeDialog(){
			dialogServices.closeDialog('table-edit-dialog');
		}
		//HELPER FUNCTION
		function getTimes(number){
			console.log(number);
			return new Array(number);
		}

		//function for external use
		var viewContentLoaded = $q.defer();
		$scope.$on('$viewContentLoaded', function () {
			$timeout(function () {
				getPagination();
				viewContentLoaded.resolve();
			}, 0);
		});
		viewContentLoaded.promise.then(function () {
			$timeout(function () {
				componentHandler.upgradeDom();
			}, 0);
		});	
	}
})();
