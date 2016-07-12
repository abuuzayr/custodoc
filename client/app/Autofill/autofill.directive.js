angular.module('app.autofill')
.directive('customMdlDataTable',customMdlDataTable)
.directive('postRepeatUpgrade', postRepeatUpgrade)
.controller('dataTableController',dataTableController);

function customMdlDataTable(){
	var directive = {
		restrict: 'E',
		templateUrl: '/app/Autofill/dataTable.template.html',
		scope:{
			tableOptions: '=tableOptions' 
		},
		controller: 'dataTableController'
		//controllerAs: 'dataTableCtrl'
	};
	return directive;
}


function postRepeatUpgrade(){
	return function(scope, element, attrs){
		if(scope.$last){
			componentHandler.upgradeDom();
		}
	};
}

dataTableController.$inject = ['$scope','$timeout','feedbackServices'];

function dataTableController($scope,$timeout,feedbackServices){
	var tableOptions = $scope.tableOptions;

	$scope.toFirstPage = toFirstPage;
	$scope.toLastPage = toLastPage;
	$scope.toNextPage = toNextPage;
	$scope.toPreviousPage = toPreviousPage;
	$scope.sort = sort;
	$scope.getTimes = getTimes;

	$scope.selectOne = selectOne;
	$scope.selectVisible = selectVisible;

	console.log(tableOptions);
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
 		console.log(tableOptions.pagination.currentPage);//TOFIX
 	}

 	//Selection Handler
 	function sort(sortBy){
 		tableOptions.sorting.sortBy = sortBy;
		tableOptions.sorting.sortReverse = !tableOptions.sorting.sortReverse;
		renderSelectionOnChange();
 	}

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
		//TOFIX
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
			console.log('rendering');//TOFIX
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
 				console.log('return false');//TOFIX
 				return false;
 			}	
 		}
		console.log('is all checked');//TOFIX
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

	function getTimes(number){
		return new Array(number);
	}
}

