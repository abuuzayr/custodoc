(function() {"use strict";
	  
angular.module('dataTable')
	.controller('dataTableController',dataTableController);

	dataTableController.$inject = ['$scope','$timeout','$q','feedbackServices','dialogServices'];
	function dataTableController($scope,$timeout,$q,feedbackServices,dialogServices){
		$scope.table = $scope.tableOptions;
		getPagination();
		//PAGE
		$scope.toFirstPage = toFirstPage;
		$scope.toLastPage = toLastPage;
		$scope.toNextPage = toNextPage;
		$scope.toPreviousPage = toPreviousPage;
		//SORT 
		$scope.sort = sort;
		$scope.getTimes = getTimes;
		//SELETION
		$scope.selectOne = selectOne;
		$scope.selectVisible = selectVisible;
		$scope.deselectAll = deselectAll;
		//EXPORT IMPORT
		$scope.exportCSV = exportCSV;
		//EDIT
		$scope.editRow = editRow;
		$scope.discardEdit = discardEdit;
		//DATA SERVICES
		$scope.deleteSelected = deleteSelected;
		$scope.saveEdit = saveEdit;
		//SEARCH
		$scope.filterByKeyword = filterByKeyword;
		$scope.filterActionCol = filterActionCol;
		$scope.filterDefaultCol = filterDefaultCol; 
		$scope.updatePaginationOnFilter = updatePaginationOnFilter;

		function updatePaginationOnFilter(){
			console.log($scope.filtered);
			$scope.table.totalPage = Math.ceil($scope.filtered.length/$scope.pagination.itemPerPage);
			$scope.table.totalItem = $scope.filtered.length;
			$scope.table.pagination.rgPage = getTimes($scope.table.pagination.totalPage);
			console.log($scope.table.pagination);
		}

		$scope.table.count = 0;
		function getPagination(){
			try{
				$scope.table.pagination.limitOptions = $scope.dtRowPerPageOptions;
				if($scope.table.pagination.limitOptions.constructor !== Array)
					throw new Error('Type Error: limitOptions expect array');
			}catch(err){
				$scope.table.pagination.limitOptions = [10,20,30];
				console.log(err);
			}
			finally{
					$scope.table.pagination.itemPerPage = $scope.table.pagination.limitOptions[0];
					console.log($scope.table.pagination);
			}	
		}

		$scope.$watch('table.filterQuery',function (newVal, oldVal){
			$scope.table.count = 0;
			console.log(newVal, $scope.table.count);
	 	});
		//PAGINATION
	 	$scope.$watch('table.pagination.currentPage',function onPageChange(newPage, oldPage){
			$scope.table.pagination.startingIndex = (newPage - 1) * $scope.table.pagination.itemPerPage + 1 < $scope.table.pagination.totalItem ? (newPage - 1) * $scope.table.pagination.itemPerPage : $scope.table.pagination.totalItem;
			renderSelectionOnChange();
	 	});

	 	$scope.$watch('table.pagination.itemPerPage',function onItemPerPageChange(newLimit, oldLimit){
			$scope.table.pagination.itemPerPage = newLimit;
			$scope.table.pagination.totalPage = Math.ceil($scope.table.pagination.totalItem/$scope.table.pagination.itemPerPage);
			$scope.table.pagination.rgPage = getTimes($scope.table.pagination.totalPage);
			renderSelectionOnChange();
	 	});

	 	function toFirstPage(){
	 		$scope.table.pagination.currentPage = 1;
	 	}

	 	function toLastPage(){
	 		$scope.table.pagination.currentPage = $scope.table.pagination.totalPage;
	 	}

	 	function toNextPage(){
	 		if($scope.table.pagination.currentPage < $scope.table.pagination.totalPage)
	 			$scope.table.pagination.currentPage++;
	 		else
	 			feedbackServices.errorFeedback('Last page', 'autofill-feedbackMessage');
	 	}

	 	function toPreviousPage(){
	 		if($scope.table.pagination.currentPage > 1)
	 			$scope.table.pagination.currentPage--;
	 		else
	 			return feedbackServices.errorFeedback('First page', 'autofill-feedbackMessage');

	 	}

	 	//Selection Handler
	 	function selectVisible($event){
	 		var checkbox = $event.target;
	  		var action = (checkbox.checked ? 'add' : 'remove');
	  		var elementList = angular.element( document.querySelectorAll( "[id^='data-table-checkbox-label-']") );
	  		var elementId = '';
	  		for ( var i = 0; i < elementList.length; i++) {
	  			elementId = elementList[i].id.replace('data-table-checkbox-label-','');
	  			if(action==='add' && $scope.table.selection.selectedId.indexOf(elementId) === -1){
	  				updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-',''));
	  			}else if(action==='remove' && $scope.table.selection.selectedId.indexOf(elementId) != -1){
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
	 		$scope.table.selection.checked = { headerChecked:false };
	 		$scope.table.selection.selectedId = [];
	 		$scope.table.selection.selected = [];
	 		renderSelectionOnChange();
	 	}

	 	function updateSelection(target, action , id){
			return action === 'add' ? addToSelection(target, id) : removeFromSelection(target,id);

			function addToSelection(target, id){
				if($scope.table.selection.selectedId.indexOf(id) === -1){
					$scope.table.selection.selectedId.push(id);
					if(target && (!$scope.table.selection.checked.hasOwnProperty(id) || (!$scope.table.selection.checked[id] && !$scope.table.selection.checked.hasOwnProperty(id))))
						target.checked = true;
				}
			}

			function removeFromSelection(target,id){
				if($scope.table.selection.selectedId.indexOf(id) !== -1){
					$scope.table.selection.selectedId.splice($scope.table.selection.selectedId.indexOf(id), 1);
					if(target && (!$scope.table.selection.checked.hasOwnProperty(id) || $scope.table.selection.checked[id]))
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
					if( $scope.table.selection.selectedId.indexOf(elementId) === -1 && angular.element(elementList[i]).hasClass('is-checked') ){
						elementList[i].MaterialCheckbox.uncheck();
					}else if($scope.table.selection.selectedId.indexOf(elementId) !== -1 && !angular.element(elementList[i]).hasClass('is-checked')){
						elementList[i].MaterialCheckbox.check();
					}
				}
				//header
				if(elementList && elementList.length > 0 ){
					if(isAllChecked(elementList)){
							$scope.table.selection.checked.headerChecked = true;
							headerCheckbox.MaterialCheckbox.check();
					}else{
							$scope.table.selection.checked.headerChecked = false;
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
			for( var i = 0, len = $scope.table.tableData.data.length; i < len; i++) {
	    		lookup[$scope.table.tableData.data[i]._id] = $scope.table.tableData.data[i];
			}
			for( var index = 0, length = $scope.table.selection.selectedId.length; index < length; index++){
				console.log($scope.table.selection.selectedId[index]);
				$scope.table.selection.selected.push(lookup[$scope.table.selection.selectedId[index]]);
			}
			console.log($scope.table.selection.selected);
		}

		//SORTING AND FILTERING
		function sort(sortBy){
	 		$scope.table.sorting.sortBy = sortBy;
			$scope.table.sorting.sortReverse = !$scope.table.sorting.sortReverse;
			renderSelectionOnChange();
	 	}

	 	function filterByKeyword(element) {
			if($scope.table.filterQuery === 'undefined' || !$scope.table.filterQuery){
				return true;
			}
            for (var property in element) {
                for (var i=0; i < $scope.table.tableData.columnDefs.length; i++) {
			        if ($scope.table.tableData.columnDefs[i].fieldName === property) {
			            if (element.hasOwnProperty(property)) {
		                    if (typeof element[property] === 'string') {
		                        if (element[property].toLowerCase().indexOf($scope.table.filterQuery.toLowerCase()) != -1) {
		                            $scope.table.count++;
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
				return feedbackServices.errorFeedback('Please select a valid export option','autofill-feedbackMessage');
		}

		function exportSelected(){
			getDataFromId();
			if($scope.table.selection.selected == [] || $scope.table.selection.selected.length < 1)
				return feedbackServices.errorFeedback('Please select at least one row','autofill-feedbackMessage'); 
			else	
				return download(Papa.unparse($scope.table.selection.selected));
		}

		function exportAll(){
			console.log('all');
			var csv = Papa.unparse($scope.table.tableData.data);
			return download(csv);
		}

		function download(csv){
			var blob =  new Blob([csv],{tpye:'text/csv;charset=utf-8;'});
			var uagent = navigator.userAgent.toLowerCase();
			console.log(/safari/.test(uagent) && !/chrome/.test(uagent));
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
			$scope.table.dataServices.delete($scope.table.selection.selectedId)
			.then(function successCallback(){
				if($scope.table.selection.selectedId.length === 0){
					$timeout(function() {
						renderSelectionOnChange();
					}, 500);
				}
			});
			
		}

		function saveEdit(){
			return $scope.table.dataServices.save($scope.rowInEdit);
		}

		// function savePromise(){
		// 	var promise = saveEdit();
		// }
		
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
