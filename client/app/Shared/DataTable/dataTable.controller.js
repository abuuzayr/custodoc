angular.module('dataTable')
	.controller('dataTableController',dataTableController);

	dataTableController.$inject = ['$scope','$timeout','feedbackServices','dialogServices'];
	function dataTableController($scope,$timeout,feedbackServices,dialogServices){
		var tableOptions = $scope.tableOptions;
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
		//EXPORT IMPORT
		$scope.exportCSV = exportCSV;
		//EDIT
		$scope.editRow = editRow;
		$scope.saveEdit = saveEdit;
		$scope.discardEdit = discardEdit;
		//SEARCH
		$scope.filterByKeyword = filterByKeyword;
		$scope.filterQuery = 'hahahah';

		console.log(tableOptions);

		function getPagination(){
			try{
				tableOptions.pagination.limitOptions = $scope.dtRowPerPageOptions;
				if(tableOptions.pagination.limitOptions.constructor !== Array)
					throw new Error('Type Error: limitOptions expect array');
			}catch(err){
				tableOptions.pagination.limitOptions = [10,20,30];
				console.log(err);
			}finally{
				tableOptions.pagination.itemPerPage = tableOptions.pagination.limitOptions[0];
			}	
		}

		
		//PAGINATION
		function onDataLoaded(){
			tableOptions.pagination.totalItem = tableOptions.tableData.data.length;
			tableOptions.pagination.totalPage = Math.ceil(tableOptions.pagination.totalItem/tableOptions.pagination.itemPerPage);
			tableOptions.pagination.currentPage = 1;
	 	}

	 	$scope.$watch('tableOptions.pagination.currentPage',function onPageChange(newPage, oldPage){
	 		console.log('page change: ' + newPage);
			tableOptions.pagination.startingIndex = (newPage - 1) * tableOptions.pagination.itemPerPage + 1 < tableOptions.pagination.totalItem ? (newPage - 1) * tableOptions.pagination.itemPerPage + 1 : tableOptions.pagination.totalItem;
			tableOptions.pagination.endingIndex = (( newPage * tableOptions.pagination.itemPerPage < tableOptions.pagination.totalItem ) ? newPage * tableOptions.pagination.itemPerPage : tableOptions.pagination.totalItem);
			tableOptions.pagination.pagedItem = tableOptions.tableData.data.slice(tableOptions.pagination.startingIndex,tableOptions.pagination.endingIndex + 1);
			renderSelectionOnChange();
	 	});

	 	$scope.$watch('tableOptions.pagination.itemPerPage',function onItemPerPageChange(newLimit, oldLimit){
	 		console.log('limit change: ' + newLimit);
			var startingIndex = tableOptions.pagination.startingIndex;
			tableOptions.pagination.endingIndex = (startingIndex + newLimit - 1) < tableOptions.pagination.totalItem ?  startingIndex + newLimit - 1 : tableOptions.pagination.totalItem;
			tableOptions.pagination.itemPerPage = newLimit;
			tableOptions.pagination.pagedItem = tableOptions.tableData.data.slice(tableOptions.pagination.startingIndex,tableOptions.pagination.endingIndex + 1);
			renderSelectionOnChange();
	 	});

	 	function toFirstPage(){
	 		tableOptions.pagination.currentPage = 1;
	 	}

	 	function toLastPage(){
	 		tableOptions.pagination.currentPage = tableOptions.pagination.totalPage;
	 	}

	 	function toNextPage(){
	 		if(tableOptions.pagination.currentPage < tableOptions.pagination.totalPage)
	 			tableOptions.pagination.currentPage++;
	 		else
	 			feedbackServices.errorFeedback('Last page', 'autofill-feedbackMessage');
	 	}

	 	function toPreviousPage(){
	 		if(tableOptions.pagination.currentPage > 1)
	 			tableOptions.pagination.currentPage--;
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
	  			if(action==='add' && tableOptions.selection.selectedId.indexOf(elementId) === -1){
	  				updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-',''));
	  			}else if(action==='remove' && tableOptions.selection.selectedId.indexOf(elementId) != -1){
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

	 	function updateSelection(target, action , id){
			return action === 'add' ? addToSelection(target, id) : removeFromSelection(target,id);

			function addToSelection(target, id){
				if(tableOptions.selection.selectedId.indexOf(id) === -1){
					tableOptions.selection.selectedId.push(id);
					if(target && (!tableOptions.selection.checked.hasOwnProperty(id) || (!tableOptions.selection.checked[id] && !tableOptions.selection.checked.hasOwnProperty(id))))
						target.checked = true;
				}
				else 
					console.log('already have row ??');
			}

			function removeFromSelection(target,id){
				if(tableOptions.selection.selectedId.indexOf(id) !== -1){
					tableOptions.selection.selectedId.splice(tableOptions.selection.selectedId.indexOf(id), 1);
					if(target && (!tableOptions.selection.checked.hasOwnProperty(id) || tableOptions.selection.checked[id]))
						target.checked = false;
				}
				else
					console.log('not removed');
			}
	 	}

	 	function renderSelectionOnChange(){
			$timeout( function() {

				var headerCheckbox = angular.element(document.querySelectorAll("[id^='data-table-header-checkbox-label']"))[0];
				var elementList = angular.element(document.querySelectorAll("[id^='data-table-checkbox-label-']"));
				var elementId = '';
				for(var i = 0 ; i < elementList.length; i++){
					
					elementId = elementList[i].id.replace('data-table-checkbox-label-','');
					console.log(elementId,tableOptions.selection.selectedId.indexOf(elementId));
					if( tableOptions.selection.selectedId.indexOf(elementId) === -1 && angular.element(elementList[i]).hasClass('is-checked') ){
						elementList[i].MaterialCheckbox.uncheck();
					}else if(tableOptions.selection.selectedId.indexOf(elementId) !== -1 && !angular.element(elementList[i]).hasClass('is-checked')){
						elementList[i].MaterialCheckbox.check();
					}
				}
				//header
				if(elementList && elementList.length > 0 ){
					if(isAllChecked(elementList)){
						if(!tableOptions.selection.checked.headerChecked)
							tableOptions.selection.checked.headerChecked = true;
							headerCheckbox.MaterialCheckbox.check();
					}else{
						if(tableOptions.selection.checked.headerChecked){
							tableOptions.selection.checked.headerChecked = false;
							headerCheckbox.MaterialCheckbox.uncheck();
						}	
					}
				}
	  		}, 0, false);
	 	}

	 	function isAllChecked(elementList){
	 		console.log(elementList.length);
	 		for(var i = 0 ; i < elementList.length; i++){
	 			if(!angular.element(elementList[i]).hasClass('is-checked')){

	 				return false;
	 			}	
	 		}

	 		return true;
	 	}

	 	function getDataFromId(){
	 		var lookup = {};
			for( var i = 0, len = tableOptions.tableData.data.length; i < len; i++) {
	    		lookup[tableOptions.tableData.data[i]._id] = tableOptions.tableData.data[i];
			}
			for( var index = 0, length = tableOptions.selection.selectedId.length; index < length; index++){
				console.log(tableOptions.selection.selectedId[index]);
				tableOptions.selection.selected.push(lookup[tableOptions.selection.selectedId[index]]);
			}
			console.log(tableOptions.selection.selected);
		}


		//SORTING AND FILTERING
		function sort(sortBy){
	 		tableOptions.sorting.sortBy = sortBy;
			tableOptions.sorting.sortReverse = !tableOptions.sorting.sortReverse;
			renderSelectionOnChange();
	 	}

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
			var csv = null;
			getDataFromId();
			if(tableOptions.selection.selected == [] || tableOptions.selection.selected.length < 1)
				return feedbackServices.errorFeedback('Please select at least one row','autofill-feedbackMessage'); 
			else	
				csv = Papa.unparse(tableOptions.selection.selected);
			return download(csv);
		}

		function exportAll(){
			console.log('all');
			var csv = Papa.unparse(tableOptions.tableData.data);
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
			return tableOptions.dataServices.delete(tableOptions.selection.selectedId);
		}

		function saveEdit(){
			return tableOptions.dataServices.save($scope.rowInEdit);
		}

		// function savePromise(){
		// 	var promise = saveEdit();
		// }
		function filterByKeyword(element) {
			if($scope.tableOptions.filterQuery === 'undefined' || !$scope.tableOptions.filterQuery){
				$scope.tableOptions.filterQuery = '';
			}
            for (var property in element) {
                if (tableOptions.tableData.columnDefs.indexOf(property) === -1)
                    continue;
                if (element.hasOwnProperty(property)) {
                    if (typeof element[property] === 'string') {
                        if (element[property].toLowerCase().indexOf($scope.tableOptions.filterQuery.toLowerCase()) != -1) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

		function openDialog(){
			dialogServices.openDialog('table-edit-dialog');
		}
		function closeDialog(){
			dialogServices.closeDialog('table-edit-dialog');
		}
		//HELPER FUNCTION
		function getTimes(number){
			return new Array(number);
		}

		//function for external use
}
