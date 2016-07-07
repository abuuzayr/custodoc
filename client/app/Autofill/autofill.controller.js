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
	vm.gridOptions = {};
	vm.gridOptions.data = [];
	vm.gridOptions.columnDefs = [];
	vm.gridOptions.rowHeight = 50;
	vm.gridOptions.enableColumnResizing = true;
	vm.gridOptions.enableFiltering = true;
	vm.gridOptions.enableGridMenu = false;
	vm.gridOptions.enableColumnMenus = false
	vm.gridOptions.showGridFooter = false;
	vm.gridOptions.showColumnFooter = false;
	vm.gridOptions.fastWatch = true;
	vm.gridOptions.multiSelect = true;
	vm.gridOptions.gridMenuShowHideColumns = false;
	vm.gridOptions.importerShowMenu = false;
	
	vm.gridOptions.importerDataAddCallback = function ( grid, newObjects ) {
      vm.gridOptions.data = vm.gridOptions.data.concat( newObjects );
    }
	
	
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
		return componentHandler.upgradeDom()
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

	vm.resetGrid = function(){
		return initGrid();
	}

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
				feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage')
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

	function initGrid(){
		console.log('initing');
		vm.gridOptions.columnDefs = [];

		return autofillServices
		.getElement()
		.then(function SuccessCallback(res){
			console.log(res.data);
			for(var i = 0; i < res.data.length; i++){
				vm.gridOptions.columnDefs.push({
					name: res.data[i].fieldName,
					displayName: res.data[i].fieldName.charAt(0).toUpperCase() +  res.data[i].fieldName.slice(1),
					width: '20%'
				});
			} 
			return vm.read();
		})
		.catch(function ErrorCallback(err){ 
			console.log(err);
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage')
		});        
	}
	
	function update( rowEntity ) {
		console.log(rowEntity);
		if(rowEntity && rowEntity._id != null && rowEntity._id != undefined)
			var promise = autofillServices.updateRecord(rowEntity);
		else
			var promise = autofillServices.createRecord(rowEntity);
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
			return feedbackServices.successFeedback('records deleted', 'autofill-feedbackMessage')
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
				update);
	};

	/* =========================================== Load animation =========================================== */

	/* =========================================== mdl data table =========================================== */
	vm.table = {}
	vm.table.options = {
		rowSelection: true,
		multiSelect: true,//TOFIX: ACCESS CONTROL
		orderBy: '',
		rowLimit: 20,
		page: 1,
		limitOptions: [10,20,30]
	}
	vm.table.dataHeader = [];
	vm.table.data = [];
	vm.table.selected = [];

	function getDataHeader(){
		return autofillServices.getElement()
		.then(function SuccessCallback(res){
			for(var i = 0; i < res.data.length; i++){
				vm.table.dataHeader.push(res.data[i].fieldName);
			}
			vm.table.options.orderBy = vm.table.dataHeader[0];
			console.log(vm.table.dataHeader);
		}).catch(function ErrorCallback (err) {
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
		})
	}

	function getDataBody(){
		return autofillServices.getRecords()
		.then(function SuccessCallback(res){
			for(var i = 0; i < 100; i++){
				vm.table.data.push(res.data[i]);
			}
		}).catch(function ErrorCallback(err){
			return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
		})
	}

	vm.logOrder = function(){ console.log(vm.table.options.orderBy) }

	getDataHeader();
	getDataBody();



		
}
