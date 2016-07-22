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

		vm.tableOptions = {};
		vm.tableOptions.data = [];
		vm.tableOptions.columnDefs = [];
		vm.tableOptions.enableMultiSelect = true;
		vm.tableOptions.enablePagination = true;
		vm.tableOptions.enableEdit = true;
		vm.tableOptions.enableDelete = true;
		vm.tableOptions.enableExport = true;
		vm.tableOptions.enableImport = true;
		vm.tableOptions.saveFunc = saveFunc;
		vm.tableOptions.deleteFunc = deleteSelected;
		vm.tableOptions.importFunc = importFunc;
		init();
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

		function saveFunc(rowEntity){
			return autofillServices.updateRecord(rowEntity)
			.then(function SuccessCallback(res){		
				return feedbackServices.successFeedback('records updated', 'autofill-feedbackMessage');
			})
			.catch(function ErrorCallback(err) {
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}

		function importFunc(objectArray){
			for(var = i ; i < objectArray.length; i++){
				
			}
		}

		function postDeleteUpdate(){
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
			vm.tableOptions.columnDefs = [];
			return autofillServices.getElement()
			.then(function SuccessCallback(res){
				for(var i = 0; i < res.data.length; i++){
					vm.tableOptions.columnDefs.push({
						type:'default',
						displayName:res.data[i].fieldName.toUpperCase(),
						fieldName:res.data[i].fieldName
					});
				}
				vm.tableOptions.columnDefs.push({ 
					type:'action',
					icon:'delete',
					action: function(row){
						console.log('row');
						console.log(row);
					} 
				});
			}).catch(function ErrorCallback (err) {
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}

		function getDataBody(){
			vm.tableOptions.data = [];
			return autofillServices.getRecords(vm.query)
			.then(function SuccessCallback(res){
				for(var i = 0; i < res.data.length; i++){
					vm.tableOptions.data.push(res.data[i]);
				}
			}).catch(function ErrorCallback(err){
				return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			});
		}

		function init(){
			getDataBody();
			getDataHeader();	
		}

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
