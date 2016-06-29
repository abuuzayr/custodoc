var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit','ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);
	app.controller('MainCtrl', MainCtrl)

	MainCtrl.$inject = ['$scope', '$q', '$timeout',  'uiGridConstants', 'uiGridGroupingConstants', 'dialogServices','feedbackServices','autofillServices']

	function MainCtrl($scope , $q, $timeout, uiGridConstants, uiGridGroupingConstants, dialogServices, feedbackServices, autofillServices) {
	var vm = this;
	vm.hasSelection = false;
	vm.elementType = '';
	vm.options = [];
	vm.numOfOptions = 0;

	vm.textfield = {
		fieldname:'',
		type:'text',
		default:''
	}
	vm.checkbox = {
		fieldname:'',
		type:'checkbox',
		label:'',
		default:false,

	}
	vm.radio = {
		fieldname:'',
		type:'radio',
		options: [],
		default:'',
		display:'',
	}
	vm.dropdown = {
		fieldname:'',
		type:'dropdown',
		options: [],
		default:''
	}


	vm.query ='';
	vm.gridOptions = {};
	vm.gridOptions.data = [];
	vm.gridOptions.columnDefs = [];
	vm.gridOptions.rowHeight = 50;
	vm.gridOptions.enableColumnResizing = true;
	vm.gridOptions.enableFiltering = true;
	vm.gridOptions.enableGridMenu = true;
	vm.gridOptions.showGridFooter = false;
	vm.gridOptions.showColumnFooter = false;
	vm.gridOptions.fastWatch = true;
	vm.gridOptions.multiSelect = true;
	vm.gridOptions.gridMenuShowHideColumns = false;
	vm.gridOptions.importerShowMenu = false;

	

//	vm.deleteRow = deleteRow;


	
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
	vm.addOption  = function(){
		vm.numOfOptions++;
		console.log(vm.numOfOptions)
	};

	vm.removeOption = function(){
		if(vm.numOfOptions > 0)
			vm.numOfOptions--
		else 
			vm.numOfOptions = 0;
	};

	vm.clearSelected = function() {
		vm.gridApi.selection.clearSelectedRows();
		vm.hasSelection = false;
	};

	vm.deleteSelected = function() {
		var selectedRows = vm.gridApi.selection.getSelectedRows();
		var selectedId = [];
		for(var i = 0 ; i < selectedRows.length ; i++){
			selectedId.push(selectedRows[i]._id);
			vm.gridOptions.data.splice(vm.gridOptions.data.indexOf(selectedRows[i]), 1);
		}
		if(selectedId.length === 1)
			return deleteOne(selectedId);
		return deleteMany(selectedId);
	};

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


	vm.exportCSV = function(){
		var element = angular.element(document.querySelectorAll('.custom-csv-link-location'));
	    vm.gridApi.exporter.csvExport('selected', 'all', element );
	};

	vm.importCSV = function(){
	};

	vm.read = function(){
			vm.gridOptions.data = [];

			return autofillServices
			.getRecords(vm.query)
			.then(function SuccessCallback(res){
				res.data.forEach(function(row){
					vm.gridOptions.data.push(row);
				});
				console.log(vm.gridOptions.data);
			})
			.catch(function ErrorCallback(err) {
				console.log(err);
				feedbackServices.errorFeedback(err.data.description, 'autofill-feedbackMessage')
			});
	};

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
		componentHandler.upgradeDom();
	};

	vm.closeDialog = function(){
		vm.elementType = '';
		dialogServices.closeDialog('create-element-dialog');	
	};

	// ============================================== Helper Func ============================================== //
	

	vm.getTimes = function(number){
		return new Array(number);
	};
	// ============================================== API ============================================== //

	function initGrid(){
		vm.gridOptions.columnDefs = [];

		return autofillServices
		.getElement()
		.then(function SuccessCallback(res){
			console.log(res.data);
			for(var i = 0; i < res.data.length; i++){
				vm.gridOptions.columnDefs.push({name: res.data[i].fieldname }); 
			}

			vm.gridOptions.columnDefs.push({
				name: ' ',
				enableCellEdit: false,
				allowCellFocus : false,
				cellTemplate:'cellTemplate.html'
			});

			return vm.read()
		})
		.catch(function ErrorCallback(err){ 
			console.log(err);
			return feedbackServices.errorFeedback(err.data.description, 'autofill-feedbackMessage')
		});        
	}
	
	function updateOne( rowEntity ) {
		var promise = autofillServices.updateRecords(rowEntity);
		vm.gridApi.rowEdit.setSavePromise(rowEntity, promise)
	}

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
			return feedbackServices.errorFeedback(err.data.description, 'autofill-feedbackMessage')
		});
	}
	
	function deleteMany(rgSelectedId){
		console.log(rgSelectedId);

		return autofillServices.deleteRecords(rgSelectedId)
		.then(function SuccessCallback(res){
			vm.clearSelected();
			console.log('delete response: ');
			console.log(data);
			return feedbackServices.successFeedback('records deleted', 'autofill-feedbackMessage')
		})
		.catch(function ErrorCallback(err) {
			console.log(err);
			return feedbackServices.errorFeedback(err.data.description, 'autofill-feedbackMessage');
		});
	}

	function createElement(elementData){
		return autofillServices.createElement(elementData)
		.then(function SuccessCallback(res){
			return feedbackServices.successFeedback(elementData.type + ' element saved', 'autofill-feedbackMessage')
		})
		.catch(function ErrorCallback(err){
			console.log(err);
			return feedbackServices.errorFeedback(err.data.description, 'autofill-feedbackMessage');
		})
	}
	
	initGrid();

	//Additional
	vm.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			vm.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope,function(row){
				if(vm.gridApi.grid.selection.selectedCount)
					vm.hasSelection = true;
				else
					vm.hasSelection = false;
			});
 
			gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
				if(vm.gridApi.grid.selection.selectedCount)
					vm.hasSelection = true;
				else
					vm.hasSelection = false;
			});

			gridApi.rowEdit.on.saveRow($scope, 
				updateOne);
	};

	/* =========================================== Load animation =========================================== */
		
}
