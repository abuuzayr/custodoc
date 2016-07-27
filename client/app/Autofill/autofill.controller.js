(function () {
	"use strict";

	angular.module('app.autofill')
		.controller('autofillCtrl', autofillCtrl);

	autofillCtrl.$inject = ['$scope', '$q', '$timeout', 'dialogServices', 'feedbackServices', 'autofillServices'];

	function autofillCtrl($scope, $q, $timeout, dialogServices, feedbackServices, autofillServices) {
		// ===========================================   Initialization  =========================================== //
        /* jshint validthis: true */
		var vm = this;
		vm.elementType = '';
		vm.numOfOptions = 0;

		vm.upgradeDom = upgradeDom;
		vm.addOption = addOption;
		vm.removeOption = removeOption;
		vm.saveElement = saveElement;
		vm.createTextfield = createTextfield;
		vm.createCheckbox = createCheckbox;
		vm.createRadio = createRadio;
		vm.createDropdown = createDropdown;
		vm.getTimes = getTimes;
		vm.openDialog = openDialog;
		vm.closeDialog = closeDialog;
		vm.deleteSelected = deleteSelected;
		vm.reset = init;

		vm.textfield = {
			fieldName: '',
			type: 'text',
			default: ''
		};
		vm.checkbox = {
			fieldName: '',
			type: 'checkbox',
			label: '',
			default: false,
		};
		vm.radio = {
			fieldName: '',
			type: 'radio',
			options: [],
			default: '',
			display: '',
		};
		vm.dropdown = {
			fieldName: '',
			type: 'dropdown',
			options: [],
			default: ''
		};

		vm.tableOptions = {};
		vm.tableOptions.data = [];
		vm.tableOptions.columnDefs = [];
		vm.tableOptions.enableMultiSelect = false;
		vm.tableOptions.enablePagination = true;
		vm.tableOptions.enableEdit = true;
		vm.tableOptions.enableDelete = true;
		vm.tableOptions.enableExport = true;
		vm.tableOptions.enableImport = true;
		vm.tableOptions.saveFunc = saveFunc;
		vm.tableOptions.deleteFunc = deleteSelected;
		vm.tableOptions.importFunc = importFunc;
		init();

		// ===========================================   UI Buttons  =========================================== //
		function upgradeDom() {
			return componentHandler.upgradeDom();
		}

		function addOption() {
			vm.numOfOptions++;
		}

		function removeOption(elementType) {
			if (vm.numOfOptions > 0) {
				vm.numOfOptions--;
				if (elementType === 'radio') {
					vm.radio.options.pop();
				}
				else if (elementType == 'dropdown') {
					vm.dropdown.options.pop();
				}

			}
			else
				vm.numOfOptions = 0;
		}

		/**
		 * If one item selected, deleteOne(selectedId). Else, deleteMany.
		 * 
		 * @param {any} rgSelectedId
		 * @returns {function} 
		 */
		function deleteSelected(rgSelectedId) {
			// console.log('deleteSelected in autofill');//TOFIX
			var selectedId = rgSelectedId;
			if (selectedId.length === 1)
				return deleteOne(selectedId);
			return deleteMany(selectedId);
		}

		/**
		 * Save element by creating it in the database. Else, returns error feedback message if element type is not found.
		 * 
		 * @param {any} elementType
		 * @returns
		 */
		function saveElement(elementType) {
			var elementData = {};
			// console.log(elementType);
			switch (elementType) {
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
					return feedbackServices.errorFeedback('Selection error', 'autofill-feedbackMessage');
			}
			return createElement(elementData)
				.then(vm.closeDialog());
		}

		function createTextfield() {
			vm.elementType = 'text';
			vm.openDialog();
		}

		function createCheckbox() {
			vm.elementType = 'checkbox';
			vm.openDialog();
		}

		function createRadio() {
			vm.elementType = 'radio';
			vm.openDialog();
		}

		function createDropdown() {
			vm.elementType = 'dropdown';
			vm.openDialog();
		}

		function openDialog() {
			dialogServices.openDialog('create-element-dialog');
		}

		function closeDialog() {
			vm.elementType = '';
			dialogServices.closeDialog('create-element-dialog');
		}

		// ============================================== Helper Func ============================================== //

		function getTimes(number) {
			return new Array(number);
		}

		var handleFileSelect = function (event) {
			var target = event.srcElement || event.target;
			if (target && target.files && target.files.length === 1) {
				var fileObject = target.files[0];
				vm.gridApi.importer.importFile(fileObject);
				target.form.reset();
			}
		};

		var fileChooser = document.querySelectorAll('.file-chooser');

		if (fileChooser.length !== 1) {
			// console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
		} else {
			fileChooser[0].addEventListener('change', handleFileSelect, false);  // TODO: why the false on the end?  Google  
		}

		// ============================================== API ============================================== //

		function deleteOne(selectedId) {
			return autofillServices
				.deleteOneRecord(selectedId)
				.then(function SuccessCallback(res) {
					postDeleteUpdate();
					return feedbackServices.successFeedback('record deleted', 'autofill-feedbackMessage');
				})
				.catch(function ErrorCallback(err) {
					return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
				});
		}

		function deleteMany(rgSelectedId) {
			return autofillServices.deleteRecords(rgSelectedId)
				.then(function SuccessCallback(res) {
					postDeleteUpdate();
					return feedbackServices.successFeedback('records deleted', 'autofill-feedbackMessage');
				})
				.catch(function ErrorCallback(err) {
					return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
				});
		}

		function saveFunc(rowEntity) {
			var deferred = $q.defer();
			autofillServices.updateRecord(rowEntity)
				.then(SuccessCallback)
				.catch(ErrorCallback);
			return deferred.promise;

			function SuccessCallback(msg) {
				deferred.resolve(msg);
				feedbackServices.successFeedback('Records updated', 'autofill-feedbackMessage');
			}

			function ErrorCallback(err) {
				deferred.reject(err);
				feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
			}
		}

		function importFunc(objectArray) {
			var deferred = $q.defer();
			var promises = [];
			for (var i = 0; i < objectArray.length; i++) {
				promises.push(createRecord(objectArray[i]));
			}
			$q.all(promises)
				.then(SuccessCallback)
				.catch(ErrorCallback);
			return deferred.promise;

			function SuccessCallback(res) {
				deferred.resolve(res.data);
			}
			function ErrorCallback(err) {
				deferred.reject(err.description);
			}
		}


		function createRecord(autofillData) {
			var deferred = $q.defer();
			autofillServices.createRecord(autofillData)
				.then(SuccessCallback)
				.catch(ErrorCallback);
			return deferred.promise;

			function SuccessCallback(res) {
				vm.tableOptions.data.unshift(autofillData);
				deferred.resolve(res.data);
			}
			function ErrorCallback(err) {
				deferred.reject(err.description);
			}
		}


		function postDeleteUpdate() {
			init();
		}



		/* =========================================== Element =========================================== */

		function createElement(elementData) {
			return autofillServices.createElement(elementData)
				.then(function SuccessCallback(res) {
					var elementType = elementData.type == 'text' ? 'textfield' : elementData.type;
					return feedbackServices.successFeedback(elementType + ' saved', 'autofill-feedbackMessage');
				})
				.catch(function ErrorCallback(err) {
					// console.log(err);
					return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
				});
		}


		/* =========================================== mdl data table =========================================== */
		function getDataHeader() {
			vm.tableOptions.columnDefs = [];
			return autofillServices.getElement()
				.then(function SuccessCallback(res) {
					for (var i = 0; i < res.data.length; i++) {
						vm.tableOptions.columnDefs.push({
							type: 'default',
							displayName: res.data[i].fieldName.toUpperCase(),
							fieldName: res.data[i].fieldName,
							enableEdit: true
						});
					}
					vm.tableOptions.columnDefs.push({
						type: 'action',
						icon: 'delete',
						action: function (row) {
							// console.log('row');
							// console.log(row);
						}
					});
				}).catch(function ErrorCallback(err) {
					return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
				});
		}

		function getDataBody() {
			vm.tableOptions.data = [];
			return autofillServices.getRecords()
				.then(function SuccessCallback(res) {
					for (var i = 0; i < res.data.length; i++) {
						vm.tableOptions.data.push(res.data[i]);
					}
				}).catch(function ErrorCallback(err) {
					return feedbackServices.errorFeedback(err.data, 'autofill-feedbackMessage');
				});
		}

		function init() {
			getDataBody();
			getDataHeader();
		}
	}
})();
