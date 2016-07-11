angular.module('app.autofill')
	.controller('autofillCtrl', autofillCtrl)

	autofillCtrl.$inject = ['$scope', '$q', '$timeout',  'uiGridConstants', 'uiGridGroupingConstants', 'dialogServices','feedbackServices','autofillServices']

	function autofillCtrl($scope , $q, $timeout, uiGridConstants, uiGridGroupingConstants, dialogServices, feedbackServices, autofillServices) {
	var vm = this;
	vm.hasSelection = false;
	vm.elementType = '';
	vm.numOfOptions = 0;

	vm.textfield = {
		fieldName:'',
		type:'text',
		default:''
	}
	vm.checkbox = {
		fieldName:'',
		type:'checkbox',
		label:'',
		default:false,

	}
	vm.radio = {
		fieldName:'',
		type:'radio',
		options: [],
		default:'',
		display:'',
	}
	vm.dropdown = {
		fieldName:'',
		type:'dropdown',
		options: [],
		default:''
	}


	vm.query ='';
	
// ===========================================   	UI 	  	=========================================== //
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
			
	// ===========================================   UI Buttons  =========================================== //
	vm.upgradeDom = function(){
		console.log('upgrade DOM');
		return componentHandler.upgradeDom();
	}

	vm.addOption  = function(){
		vm.numOfOptions++;
		console.log(vm.numOfOptions)
	};

	vm.removeOption = function(elementType){
		if(vm.numOfOptions > 0){
			vm.numOfOptions--;
			if(elementType === 'radio'){
				vm.radio.options.pop();
			}
			else if(elementType == 'dropdown'){
				vm.dropdown.options.pop();
			}
				
		}	
		else 
			vm.numOfOptions = 0;
	};

	// vm.deleteSelected = function() {
	// 	var selectedRows = vm.gridApi.selection.getSelectedRows();
	// 	var selectedId = [];
	// 	for(var i = 0 ; i < selectedRows.length ; i++){
	// 		selectedId.push(selectedRows[i]._id);
	// 		vm.gridOptions.data.splice(vm.gridOptions.data.indexOf(selectedRows[i]), 1);
	// 	}
	// 	if(selectedId.length === 1)
	// 		return deleteOne(selectedId);
	// 	return deleteMany(selectedId);
	// };

	vm.saveElement = function(elementType){
		var elementData = {}
		console.log(elementType);
		switch(elementType){
			case 'text':
				elementData = vm.textfield;
				break;
			case 'checkbox':
				elementData = vm.checkbox;
				break;
			case 'radio':
				elementData = vm.radio;
				break;
			case 'dropdown':
				elementData = vm.dropdown;
				break;
			default:
				return feedbackServices.errorFeedback('selection error', 'autofill-feedbackMessage');
		}
		console.log(elementData);

		return createElement(elementData)
		.then(vm.closeDialog());
	};


	// vm.read = function(){
	// 		vm.gridOptions.data = [];

	// 		return autofillServices
	// 		.getRecords(vm.query)
	// 		.then(function SuccessCallback(res){
	// 			res.data.forEach(function(row){
	// 				vm.gridOptions.data.push(row);
	// 			});
	// 			console.log(vm.gridOptions.data);
	// 		})
	// 		.catch(function ErrorCallback(err) {
	// 			console.log(err);
	// 			feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage')
	// 		});
	// };

	vm.createTextfield	= function(){
		vm.elementType = 'text';
		vm.openDialog();
	};

	vm.createCheckbox	= function(){
		vm.elementType = 'checkbox';
		vm.openDialog();
	};

	vm.createRadio	= function(){
		vm.elementType = 'radio';
		vm.openDialog();
	};

	vm.createDropdown	= function(){
		vm.elementType = 'dropdown';
		vm.openDialog();
	};

	vm.openDialog = function(){
		dialogServices.openDialog('create-element-dialog');	
	};

	vm.closeDialog = function(){
		vm.elementType = '';
		dialogServices.closeDialog('create-element-dialog');	
	};

	// ============================================== Helper Func ============================================== //
	

	vm.getTimes = function(number){
		return new Array(number);
	};


	var handleFileSelect = function( event ){
    	var target = event.srcElement || event.target;
    	console.log(target.files)
		if (target && target.files && target.files.length === 1) {
			var fileObject = target.files[0];
			vm.gridApi.importer.importFile( fileObject );
			target.form.reset();
		}
	};
 
	var fileChooser = document.querySelectorAll('.file-chooser');

	if ( fileChooser.length !== 1 ){
		console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
	} else {
		fileChooser[0].addEventListener('change', handleFileSelect, false);  // TODO: why the false on the end?  Google  
	}




	// ============================================== API ============================================== //

	// function initGrid(){
	// 	console.log('initing');
	// 	vm.gridOptions.columnDefs = [];

	// 	return autofillServices
	// 	.getElement()
	// 	.then(function SuccessCallback(res){
	// 		console.log(res.data);
	// 		for(var i = 0; i < res.data.length; i++){
	// 			vm.gridOptions.columnDefs.push({
	// 				name: res.data[i].fieldName,
	// 				displayName: res.data[i].fieldName.charAt(0).toUpperCase() +  res.data[i].fieldName.slice(1),
	// 				width: '20%'
	// 			});
	// 		} 
	// 		return vm.read();
	// 	})
	// 	.catch(function ErrorCallback(err){ 
	// 		console.log(err);
	// 		return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage')
	// 	});        
	// }
	
	// function update( rowEntity ) {
	// 	console.log(rowEntity);
	// 	if(rowEntity && rowEntity._id != null && rowEntity._id != undefined)
	// 		var promise = autofillServices.updateRecord(rowEntity);
	// 	else
	// 		var promise = autofillServices.createRecord(rowEntity);
	// 	vm.gridApi.rowEdit.setSavePromise(rowEntity, promise)
	// }

	function deleteOne(selectedId){
		return autofillServices
		.deleteOneRecord(selectedId)
		.then(function SuccessCallback(res){
				vm.clearSelected();
				console.log('delete response: ');
				console.log(res);
				return feedbackServices.successFeedback('record deleted', 'autofill-feedbackMessage')
			})
		.catch(function ErrorCallback(err) {
			console.log(err);
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage')
		});
	}
	
	function deleteMany(rgSelectedId){
		console.log(rgSelectedId);

		return autofillServices.deleteRecords(rgSelectedId)
		.then(function SuccessCallback(res){
			vm.clearSelected();
			console.log('delete response: ');
			console.log(res);
			return feedbackServices.successFeedback('records deleted', 'autofill-feedbackMessage').then(getDataBody())
		})
		.catch(function ErrorCallback(err) {
			console.log(err);
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
		});
	}

	function createElement(elementData){
		return autofillServices.createElement(elementData)
		.then(function SuccessCallback(res){
			var elementType = elementData.type == 'text' ? 'textfield' : elementData.type;
			return feedbackServices.successFeedback( elementType + ' saved', 'autofill-feedbackMessage')
		})
		.catch(function ErrorCallback(err){
			console.log(err);
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
		})
	}
	
	//initGrid();//UIGRID


	/* =========================================== Load animation =========================================== */

	/* =========================================== mdl data table =========================================== */
	
	vm.table = {
		dataHeader: [],
		data: [],
	}

	vm.sorting = {
		sortBy: '',
		sortReverse: true
	}

	vm.checked = {
		headerChecked:false
	};

	vm.selection = {
		rowSelection: true,
		multiSelect: true,//TOFIX: ACCESS CONTROL
		selected: [],
		hasSelected: false
	}

	vm.pagination = {
		currentPage: 1,
		totalPage: 0,
		itemPerPage: 10,
		totalItem: 0,
		limitOption: [10,20,30],
		startingIndex: 0,
		endingIndex: 0,
		pagedItem: []
	}

	vm.fileOptions = {
		exportOptions: ['Selected','All'],
		importOptions:{ 
			allowedExtension: '.csv',
			maxSize: '10MB'
		}
	}

	
	vm.exportCSV = exportCSV;
	vm.deleteSelected = deleteSelected;
	vm.clearSelected = clearSelected
	vm.reset = init;
	vm.validateCsvImport = validateCsvImport;

	vm.toFirstPage = toFirstPage;
	vm.toLastPage = toLastPage;
	vm.toPreviousPage = toPreviousPage;
	vm.toNextPage = toNextPage;
	vm.sort = sort

	vm.pageFilter = function(){

	}

	function getDataHeader(){
		vm.table.dataHeader = [];
		return autofillServices.getElement()
		.then(function SuccessCallback(res){
			for(var i = 0; i < res.data.length; i++){
				vm.table.dataHeader.push(res.data[i].fieldName);
			}
			vm.sorting.sortBy = vm.table.dataHeader[0];
		}).catch(function ErrorCallback (err) {
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
		})
	}

	function getDataBody(){
		vm.table.data = [];
		return autofillServices.getRecords(vm.query)
		.then(function SuccessCallback(res){
				for(var i = 0; i < res.data.length; i++){
					vm.table.data.push(res.data[i]);
				}

			onDataLoaded();
		}).catch(function ErrorCallback(err){
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
		})
	}


	//PAGINATION

	function onDataLoaded(){
		vm.pagination.totalItem = vm.table.data.length;
		vm.pagination.totalPage = Math.ceil(vm.pagination.totalItem/vm.pagination.itemPerPage);
		vm.pagination.currentPage = 1;
		getPagedItem();
 	}

 	$scope.$watch('vm.pagination.currentPage',function onPageChange(newPage, oldPage){
		vm.pagination.startingIndex = (newPage - 1) * vm.pagination.itemPerPage + 1 < vm.pagination.totalItem ? (newPage - 1) * vm.pagination.itemPerPage + 1 : vm.pagination.totalItem;
		vm.pagination.endingIndex = (( newPage * vm.pagination.itemPerPage < vm.pagination.totalItem ) ? newPage * vm.pagination.itemPerPage : vm.pagination.totalItem)
		vm.pagination.pagedItem = vm.table.data.slice(vm.pagination.startingIndex,vm.pagination.endingIndex + 1);
		renderSelectionOnChange();
 	})

 	$scope.$watch('vm.pagination.itemPerPage',function onItemPerPageChange(newLimit, oldLimit){
		var startingIndex = vm.pagination.startingIndex;
		vm.pagination.endingIndex = (startingIndex + newLimit - 1) < vm.pagination.totalItem ?  startingIndex + newLimit - 1 : vm.pagination.totalItem;
		vm.pagination.itemPerPage = newLimit;
		vm.pagination.pagedItem = vm.table.data.slice(vm.pagination.startingIndex,vm.pagination.endingIndex + 1);
		renderSelectionOnChange();
 	})

 	function getPagedItem(){
 		vm.pagination.startingIndex = (vm.pagination.currentPage - 1) * vm.pagination.itemPerPage + 1 < vm.pagination.totalItem ? (vm.pagination.currentPage - 1) * vm.pagination.itemPerPage + 1 : vm.pagination.totalItem;
		vm.pagination.endingIndex = (( vm.pagination.currentPage * vm.pagination.itemPerPage < vm.pagination.totalItem ) ? vm.pagination.currentPage * vm.pagination.itemPerPage : vm.pagination.totalItem)
		vm.pagination.pagedItem = vm.table.data.slice(vm.pagination.startingIndex,vm.pagination.endingIndex + 1);
 	}

 	function toFirstPage(){
 		vm.pagination.currentPage = 1;
 		console.log(vm.pagination.currentPage);//TOFIX
 	}

 	function toLastPage(){
 		vm.pagination.currentPage = vm.pagination.totalPage;
 		console.log(vm.pagination.currentPage);//TOFIX
 	}

 	function toNextPage(){
 		if(vm.pagination.currentPage < vm.pagination.totalPage)
 			vm.pagination.currentPage++;
 		else
 			feedbackServices.errorFeedback('Last page', 'autofill-feedbackMessage');
 		console.log(vm.pagination.currentPage);//TOFIX
 	}

 	function toPreviousPage(){
 		if(vm.pagination.currentPage > 1)
 			vm.pagination.currentPage--;
 		else
 			return feedbackServices.errorFeedback('First page', 'autofill-feedbackMessage');
 		console.log(vm.pagination.currentPage);//TOFIX
 	}


 	//SORTING AND FILTERING
 	function sort(sortBy){
 		vm.sorting.sortBy = sortBy;
		vm.sorting.sortReverse = !vm.sorting.sortReverse;
		renderSelectionOnChange();
 	}


 	vm.selectOne = selectOne;
 	vm.selectVisible = selectVisible;
 	//SELECTION HANDLER
 	function updateSelection(target, action , id){
		return action === 'add' ? addToSelection(target, id) : removeFromSelection(target,id);
		
		//TOFIX

		function addToSelection(target, id){
			if(vm.selection.selected.indexOf(id) === -1){
				vm.selection.selected.push(id);
				if(target && (!vm.checked.hasOwnProperty(id) || (!vm.checked[id] && !vm.checked.hasOwnProperty(id))))
					target.checked = true;
			}
			else 
				console.log('already have row ??');
		}

		function removeFromSelection(target,id){
			if(vm.selection.selected.indexOf(id) != -1){
				vm.selection.selected.splice(vm.selection.selected.indexOf(id), 1);
				if(target && (!vm.checked.hasOwnProperty(id) || vm.checked[id]))
					target.checked = false;
			}
			else
				console.log('not removed');
		}
 	}

 	function clearAll(){
 		var action = 'remove';
 		for ( var i = 0; i < vm.selection.selected.length; i++) {
 			updateSelection(null, action, vm.selection.selected[i]);
 		}
 		vm.checked = { headerChecked:false };
 	}

 	function selectVisible($event){
 		var checkbox = $event.target;
  		var action = (checkbox.checked ? 'add' : 'remove');
  		var elementList = angular.element( document.querySelectorAll( "[id^='data-table-checkbox-label-']") );
  		var elementId
  		for ( var i = 0; i < elementList.length; i++) {
  			elementId = elementList[i].id.replace('data-table-checkbox-label-','');
  			if(action==='add' && vm.selection.selected.indexOf(elementId) === -1){
  				updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-',''));
  			}else if(action==='remove' && vm.selection.selected.indexOf(elementId) != -1){
  				updateSelection(checkbox, action, elementList[i].id.replace('data-table-checkbox-label-',''));
  			}
  		}
  		renderSelectionOnChange()
 	}

 	function selectOne($event, row){
 		var checkbox = $event.target;
  		var action = (checkbox.checked ? 'add' : 'remove');
  		updateSelection(checkbox, action, row._id);
  		renderSelectionOnChange();
 	}

 	function renderSelectionOnChange(){
		$timeout( function() {
			console.log('rendering');//TOFIX
			var headerCheckbox = angular.element(document.querySelectorAll("[id^='data-table-header-checkbox-label']"))[0];
			var elementList = angular.element(document.querySelectorAll("[id^='data-table-checkbox-label-']"));
			var elementId = '';
			for(var i = 0 ; i < elementList.length; i++){
				elementId = elementList[i].id.replace('data-table-checkbox-label-','');
				if( vm.selection.selected.indexOf(elementId) === -1 && angular.element(elementList[i]).hasClass('is-checked') ){
					elementList[i].MaterialCheckbox.uncheck();
				}else if(vm.selection.selected.indexOf(elementId) != -1 && !angular.element(elementList[i]).hasClass('is-checked')){
					elementList[i].MaterialCheckbox.check();
				}
			}
			//TOFIX
			if(elementList && elementList.length > 0 ){
				if(isAllChecked(elementList)){
					if(!vm.checked.headerChecked)
						vm.checked.headerChecked = true;
						headerCheckbox.MaterialCheckbox.check();
				}else{
					if(vm.checked.headerChecked){
						vm.checked.headerChecked = false
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
 				console.log('return false')//TOFIX
 				return false;
 			}	
 		}
		console.log('is all checked')//TOFIX
 		return true;
 	}

 	//EXPORT IMPORT HANDLER
	function exportCSV(exportBy){
		console.log('going to export');//TOFIX
		console.log(exportBy === 'Selected',exportBy === 'Visible',exportBy === 'All');//TOFIX
		if( exportBy === 'Selected')
			return exportSelected();
		else if( exportBy === 'All')
			return exportAll();
		else 
			return feedbackServices.errorFeedback('Please select a valid export option','autofill-feedbackMessage');
	}

	function exportSelected(){
		console.log('selected');
		if(vm.table.selected == [] || vm.table.selected.length < 1)
			return feedbackServices.errorFeedback('Please select at least one row','autofill-feedbackMessage'); 
		else	
			var csv = Papa.unparse(vm.table.selected);
		return download(csv);
	}

	function exportAll(){
		console.log('all');
		var csv = Papa.unparse(vm.table.data);
		return download(csv);
	}


	function parseComplete(result, file){
		console.log(result)//TOFIX
		console.log(file)//TOFIX
	}

	function parseError(err, file){
		return
			feedbackServices.errorFeedback('Exporting failed','autofill-feedbackMessage')
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

	function validateCsvImport(fileName){
	}


	function deleteSelected() {
		var selectedRows = vm.table.selected;
		var selectedId = [];
		for(var i = 0 ; i < selectedRows.length ; i++){
			selectedId.push(selectedRows[i]._id);
			vm.gridOptions.data.splice(vm.gridOptions.data.indexOf(selectedRows[i]), 1);
		}
		if(selectedId.length === 1)
			return deleteOne(selectedId);
		return deleteMany(selectedId);
	};

	function clearSelected(){
		vm.table.selected = [];
	}

	//Query
	$scope.$watch('vm.query',function query(newVal,oldVal){
		console.log(newVal,oldVal);
		if(newVal != oldVal){
			vm.table.options.page = 1;
			return getDataBody();
		}
	});

	function init(){
		vm.selection.selected = [];
		getDataHeader();
		getDataBody();	
	}

	init();	
}

// function sort(sortBy){
//  		vm.sorting.sortBy = sortBy;
// 		vm.sorting.sortReverse = !vm.sorting.sortReverse;
// 		// vm.table.data = vm.sorting.sortReverse ? vm.table.data.sort(compareReverse):vm.table.data.sort(compare);
// 		// return getPagedItem();

// 		// function compareReverse(a,b) {
// 		// 	if(a[sortBy] === undefined || a[sortBy] === null ||a[sortBy].toString === undefined || a[sortBy].toString === null)
// 		// 		var first = '';
// 		// 	else	
// 		// 		var first = String(a[sortBy]).toUpperCase();

// 		// 	if(b[sortBy] === undefined || b[sortBy] === null ||b[sortBy].toString === undefined || b[sortBy].toString === null)
// 		// 		var second = '';
// 		// 	else	
// 		// 		var second = String(b[sortBy]).toUpperCase();

// 		// 	if ( first < second ){
// 		// 		return -1;
// 		// 	}
// 		// 	if (first > second ){
// 		// 		return 1;
// 		// 	}
// 		// 	return 0;
// 		// }

// 		// function compare(a,b) {
// 		// 	if(a[sortBy] === undefined || a[sortBy] === null ||a[sortBy].toString === undefined || a[sortBy].toString === null)
// 		// 		var first = '';
// 		// 	else	
// 		// 		var first = String(a[sortBy]).toUpperCase();

// 		// 	if(b[sortBy] === undefined || b[sortBy] === null ||b[sortBy].toString === undefined || b[sortBy].toString === null)
// 		// 		var second = '';
// 		// 	else	
// 		// 		var second = String(b[sortBy]).toUpperCase();

// 		// 	if ( first < second ){
// 		// 		return 1;
// 		// 	}
// 		// 	if (first > second ){
// 		// 		return -1;
// 		// 	}
// 		// 	return 0;
// 		// }
//  	}
