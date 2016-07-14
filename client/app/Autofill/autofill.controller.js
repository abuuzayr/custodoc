(function() {
	  "use strict";
angular.module('app.autofill')
	.controller('autofillCtrl', autofillCtrl);

	autofillCtrl.$inject = ['$scope', '$q', '$timeout', 'dialogServices','feedbackServices','autofillServices'];

	function autofillCtrl($scope , $q, $timeout, dialogServices, feedbackServices, autofillServices) {
		var vm = this;
		vm.elementType = '';
		vm.numOfOptions = 0;

		vm.textfield = {
			fieldName:'',
			type:'text',
			default:''
		};
		vm.checkbox = {
			fieldName:'',
			type:'checkbox',
			label:'',
			default:false,
		};
		vm.radio = {
			fieldName:'',
			type:'radio',
			options: [],
			default:'',
			display:'',
		};
		vm.dropdown = {
			fieldName:'',
			type:'dropdown',
			options: [],
			default:''
		};

		vm.tableOptions = {
			tableData:{
				columnDefs:[],
				data: []
			},
			selection:{
				multiSelect: true,
				checked:{},
				selectedId:[],
				selected:[]
			},
			sorting:{
				sortBy: '',
				sortReverse: true
			},
			pagination:{
				currentPage: 1,
				totalPage: 0,
				itemPerPage: 10,
				totalItem: 0,
				limitOptions: [10,20,30],
				startingIndex: 0
			},
			exportOptions: {
				exportBy:['Selected','All'],
				ignoreProperty:[],
			},
			importOptions:{ 
				allowedExtension: '.csv',
				maxSize: '10MB'
			},
			dataServices: {
				save: function(rowData){
					console.log(rowData);
				},
				delete: deleteSelected
			}
		};


		vm.query ='';
		
		
	// ===========================================   UI Buttons  =========================================== //
		vm.upgradeDom = upgradeDom;
		vm.addOption  = addOption;
		vm.removeOption = removeOption;

		vm.saveElement = saveElement;
		vm.createTextfield	= createTextfield;
		vm.createCheckbox	= createCheckbox;
		vm.createRadio	= createRadio;
		vm.createDropdown	= createDropdown;
		vm.openDialog = openDialog;
		vm.closeDialog = closeDialog;

		function upgradeDom(){
			console.log('upgrade DOM');
			return componentHandler.upgradeDom();
		}
		
		function addOption(){
			vm.numOfOptions++;
		}

		function removeOption(elementType){
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
		}

		function deleteSelected(rgSelectedId) {
			console.log('deleteSelected in autofill');//TOFIX
			var selectedId = rgSelectedId;
			if(selectedId.length === 1)
				return deleteOne(selectedId);
			return deleteMany(selectedId);
		}
		
		function saveElement(elementType){
			var elementData = {};
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
			return createElement(elementData)
			.then(vm.closeDialog());
		}
		
		function createTextfield(){
			vm.elementType = 'text';
			vm.openDialog();
		}
		
		function createCheckbox(){
			vm.elementType = 'checkbox';
			vm.openDialog();
		}
		
		function createRadio(){
			vm.elementType = 'radio';
			vm.openDialog();
		}
		
		function createDropdown(){
			vm.elementType = 'dropdown';
			vm.openDialog();
		}
		
		function openDialog(){
			dialogServices.openDialog('create-element-dialog');	
		}
	
		function closeDialog(){
			vm.elementType = '';
			dialogServices.closeDialog('create-element-dialog');	
		}

		// ============================================== Helper Func ============================================== //
		

		vm.getTimes = function(number){
			return new Array(number);
		};

		var handleFileSelect = function( event ){
	    	var target = event.srcElement || event.target;
	    	console.log(target.files);
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
				postDeleteUpdate();
				return feedbackServices.successFeedback('record deleted', 'autofill-feedbackMessage');
			})
			.catch(function ErrorCallback(err) {
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}
		
		function deleteMany(rgSelectedId){
			return autofillServices.deleteRecords(rgSelectedId)
			.then(function SuccessCallback(res){
				postDeleteUpdate();			
				return feedbackServices.successFeedback('records deleted', 'autofill-feedbackMessage');
			})
			.catch(function ErrorCallback(err) {
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}

		function postDeleteUpdate(){
			clearAll();
			init();
		}

		/* =========================================== Element =========================================== */

		function createElement(elementData){
			return autofillServices.createElement(elementData)
			.then(function SuccessCallback(res){
				var elementType = elementData.type == 'text' ? 'textfield' : elementData.type;
				return feedbackServices.successFeedback( elementType + ' saved', 'autofill-feedbackMessage');
			})
			.catch(function ErrorCallback(err){
				console.log(err);
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}


		/* =========================================== mdl data table =========================================== */

		
		vm.deleteSelected = deleteSelected;
		vm.reset = init;
		function getDataHeader(){
			vm.tableOptions.tableData.columnDefs = [];
			return autofillServices.getElement()
			.then(function SuccessCallback(res){
				for(var i = 0; i < res.data.length; i++){
					vm.tableOptions.tableData.columnDefs.push(res.data[i].fieldName);
				}
				vm.tableOptions.sorting.sortBy = vm.tableOptions.tableData.columnDefs[0];
			}).catch(function ErrorCallback (err) {
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}

		function getDataBody(){
			vm.tableOptions.tableData.data = [];
			return autofillServices.getRecords(vm.query)
			.then(function SuccessCallback(res){
					for(var i = 0; i < res.data.length; i++){
						vm.tableOptions.tableData.data.push(res.data[i]);
					}

					onDataLoaded();
			}).catch(function ErrorCallback(err){
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}

		//PAGINATION
		function onDataLoaded(){
			vm.tableOptions.pagination.totalItem = vm.tableOptions.tableData.data.length;
			vm.tableOptions.pagination.totalPage = Math.ceil(vm.tableOptions.pagination.totalItem/vm.tableOptions.pagination.itemPerPage);
			vm.tableOptions.pagination.currentPage = 1;
			vm.tableOptions.pagination.rgPage = new Array(vm.tableOptions.pagination.totalPage);
	 	}

	 	function clearAll(){
	 		var action = 'remove';
	 		for ( var i = 0; i < vm.tableOptions.selection.selectedId.length; i++) {
	 			//updateSelection(null, action, vm.tableOptions.selection.selectedId[i]);
	 		}
	 		vm.tableOptions.selection.checked = { headerChecked:false };
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
			vm.tableOptions.selection.selectedId = [];
			getDataHeader();
			getDataBody();	
		}

		init();	

		// ===========================================   MDL LOADING  =========================================== //
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
	}
})();
