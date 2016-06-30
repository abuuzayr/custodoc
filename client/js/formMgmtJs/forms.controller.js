angular
	.module("formsApp")
	.controller("formsCtrl", ['$compile','$scope', '$q', '$location', '$timeout', '$http', 'uiGridConstants', 'formsFactory', '$state', 'usSpinnerService', formsCtrl]);

function formsCtrl($compile,$scope, $q, $location, $timeout, $http, uiGridConstants, formsFactory, $state, usSpinnerService) {
	var vm = this;
	var forms = document.getElementById('forms');
	var snackbarContainer = document.getElementById("snackbarContainer");
	vm.addNewGroup = addNewGroup;
	vm.deleteGroup = deleteGroup;
	vm.createForm = createForm;
	vm.getGroupData = getGroupData;
	vm.getFormData = getFormData;
	vm.deleteForms = deleteForms;
	vm.renameGroup = renameGroup;
	vm.renameForm = renameForm;
	vm.duplicateForm = duplicateForm;
	vm.showRecent = showRecent;
	vm.showImportant = showImportant;
	vm.setImportant = setImportant;
	vm.setNormal = setNormal;
	vm.showNewEntry = showNewEntry;
	vm.downloadAsOne = downloadAsOne;
	vm.downloadSeparate = downloadSeparate;
	vm.getTableHeight = getTableHeight;
	vm.toggleImportantIcon = toggleImportantIcon;

	//view controll

	function showNewEntry() {
		var rows = vm.gridApi.selection.getSelectedRows();
		for (var i = 0; i < rows.length - 1; i++) {
			if (rows[i].groupName !== rows[i + 1].groupName) return false;
		}
		return rows.length > 0;
	}

	//group management

	vm.getGroupData();
	function getGroupData() {
		vm.groups = [];
		$http.get("http://localhost:3000/groups")
			.then(function (res) {
				for (var i = 0; i < res.data.length; i++) {
					vm.groups.push(res.data[i].groupName);
				}
				if (vm.groups.length) {
					vm.newFormGroup = vm.groups[0];
					vm.deleteGroupName = vm.groups[0];
					vm.renameGroupOld = vm.groups[0];
					vm.duplicateTo = vm.groups[0];
				}
			});
	}


	function addNewGroup() {
		$http.post("http://localhost:3000/groups", { groupName: vm.newGroupName }, { headers: { 'Content-Type': 'application/json' } })
			.then(function (res) {
				if (res.data === "Existed") {
					alert("This group name already exists");
				} else {
					vm.getGroupData();
					snackbarContainer.MaterialSnackbar.showSnackbar(
						{ message: "Added new group" });
				}
			});
	}

	function deleteGroup() {
		if (confirm("Do you really want to delete this group? All the forms and entries data of this group will be deleted?")) {
			$http.delete("http://localhost:3000/groups/" + vm.deleteGroupName)
				.then(function (res) {
					vm.getGroupData();
					vm.getFormData();
				});
		}
	}

	function renameGroup() {
		$http.put("http://localhost:3000/groups", { originalName: vm.renameGroupOld, newName: vm.renameGroupNew }, { headers: { 'Content-Type': 'application/json' } })
			.then(function (res) {
				if (res.data === "Existed") {
					alert("This group name already exists");
				} else {
					vm.gridApi.selection.clearSelectedRows();
					vm.getGroupData();
					vm.getFormData();
					snackbarContainer.MaterialSnackbar.showSnackbar(
						{ message: "Renamed the group" });
				}
			});
	}

	//form management
	vm.gridOptions = {};
	vm.getFormData();
	var pagesImage = [];
	var rows = [];

	function downloadSeparate() {
		usSpinnerService.spin('spinner-1');
		rows = vm.gridApi.selection.getSelectedRows();
		var deferred = $q.defer();
		deferred.resolve(1);
		var p = deferred.promise;
		for (var i = 1; i <= rows.length; i++) {
			p = p.then(function (formNumber) { return generateForm(formNumber); });
			p = p.then(function (formNumber) { return generateImage(formNumber); });
		}
		p.then(function () {
			for (var j = 0; j < pagesImage.length; j++) {
				var pdf = new jsPDF();
				for (var k = 0; k < pagesImage[j].length; k++) {
					if (k != 0) {
						pdf.addPage();
					}
					pdf.addImage(pagesImage[j][k], "JPEG", 0, 0);
				}
				pdf.save();
			}
			usSpinnerService.stop('spinner-1');
			var pages = Array.from(document.getElementsByClassName('page'));
			pages.forEach(function (item, index) {
				item.parentNode.removeChild(item);
			});
			pagesImage = [];
			rows = [];
		});
	}

	function downloadAsOne() {
		usSpinnerService.spin('spinner-1');
		rows = vm.gridApi.selection.getSelectedRows();
		var pdf = new jsPDF();
		var deferred = $q.defer();
		deferred.resolve(1);
		var p = deferred.promise;
		for (var i = 1; i <= rows.length; i++) {
			p = p.then(function (formNumber) { return generateForm(formNumber); });
			p = p.then(function (formNumber) { return generateImage(formNumber); });
		}
		p.then(function () {
			for (var j = 0; j < pagesImage.length; j++) {
				for (var k = 0; k < pagesImage[j].length; k++) {
					if (j != 0 || k != 0) {
						pdf.addPage();
					}
					pdf.addImage(pagesImage[j][k], "JPEG", 0, 0);
				}
			}
			usSpinnerService.stop('spinner-1');
			pdf.save();
			var pages = Array.from(document.getElementsByClassName('page'));
			pages.forEach(function (item, index) {
				item.parentNode.removeChild(item);
			});
			pagesImage = [];
			rows = [];
		});
	}

	function generateImage(formNumber) {
		var deferred = $q.defer();
		var pageNumber = 1;
		pagesImage.push([]);
		var deferred2 = $q.defer();
		deferred2.resolve(1);
		var p2 = deferred2.promise;
		while (document.getElementById('form' + formNumber + "page" + pageNumber)) {
			p2 = p2.then(function (pageNumber) { return generateImagePromise(pageNumber); });
			pageNumber++;
		}

		return deferred.promise;

		function generateImagePromise(pageNumber) {
			var deferred2 = $q.defer();
			var canvas = document.createElement("canvas");
			canvas.width = 794;
			canvas.height = 1123;
			canvas.style.width = '794px';
			canvas.style.height = '1123px';
			var context = canvas.getContext('2d');
			var code = document.getElementById('form' + formNumber + "page" + pageNumber).innerHTML;
			rasterizeHTML.drawHTML(code).then(function (renderResult) {
				context.drawImage(renderResult.image, 0, 0);
				imgurl = canvas.toDataURL('image/jpeg', 1);
				pagesImage[formNumber - 1].push(imgurl);
				if (!document.getElementById('form' + formNumber + "page" + (pageNumber + 1))) {
					deferred.resolve(formNumber + 1);
					return;
				}
				deferred2.resolve(pageNumber + 1);
			});
			return deferred2.promise;
		}
	}

	function generateForm(formNumber) {
		var deferred = $q.defer();
		var groupName = rows[formNumber - 1].groupName;
		var formName = rows[formNumber - 1].formName;
		$http.get("http://localhost:3000/forms/" + groupName + '/' + formName)
			.then(function (res) {
				var formData = res.data;
				elements = formData.elements;
				vm.numberOfPages = formData.numberOfPages;
				for (var j = 1; j <= vm.numberOfPages; j++) {
					var newPage = formsFactory.newPage.cloneNode(true);
					newPage.setAttribute("id", 'form' + formNumber + "page" + j);
					newPage.style.display = "none";
					forms.appendChild(newPage);
				}
				for (key in elements) {
					var element = elements[key];
					if (element.name.startsWith('background_')) {
						var node = document.createElement('img');
						node.src = element.src;
						node.style.zIndex = "0";
					} else if (element.name.startsWith('label_')) {
						var node = document.createElement('div');
						node.innerHTML = element.content;
						node.style.whiteSpace = "pre-wrap";
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('text_') || element.name.startsWith('auto_text_')) {
						var node = document.createElement('input');
						node.type = 'text';
						node.placeholder = element.default;
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('auto_dropdown') || element.name.startsWith('dropdown_')) {
						var node = document.createElement('select');
						var options = element.options;
						for (var i = 0; i < options.length; i++) {
							var option = document.createElement('option');
							option.innerHTML = options[i];
							if (options[i]===element.default) option.setAttribute("selected",true);
							node.appendChild(option);
						}
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					}else if(element.name.startsWith('auto_radio') || element.name.startsWith('radio')){
						var node = document.createElement('form');
						var options = element.options;
						if (element.display==="radioInline") var display = "inline";
						else var display = "block";
						if(options.length>0){
							for(var i=0; i<options.length; i++){
								var label = document.createElement("label");
								var option = document.createElement("input");
								option.type = "radio";
								option.name = element.name;
								option.value = options[i];
								if(options[i]===element.default) option.setAttribute("checked",true);
								var span = document.createElement("span");
								span.innerHTML=options[i]+" ";
								label.style.display = display;
								label.appendChild(option);
								label.appendChild(span);
								node.appendChild(label);
							}
						}
						node.className = element.display;
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
					} else if (element.name.startsWith('signature_')) {
						var node = document.createElement('canvas');
						node.style.backgroundColor = element.backgroundColor;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('image_')) {
						var node = document.createElement('canvas');
						node.style.backgroundColor = element.backgroundColor;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('auto_checkbox') || element.name.startsWith('checkbox_')) {
						var node = document.createElement('label');
						var span = document.createElement('span');
						var checkbox = document.createElement('input');
						checkbox.type = "checkbox";
						if(element.default) checkbox.setAttribute("checked",true);
						checkbox.setAttribute("ng-checked",element.default);
						$compile(checkbox)($scope);
						span.innerHTML = element.label;
						node.appendChild(checkbox);
						node.appendChild(span);
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					}
					node.style.opacity = element.opacity;
					node.style.border = element.border;
					node.style.borderRadius = element.borderRadius;
					node.style.overflow = "hidden";
					node.style.lineHeight = "100%";
					node.style.position = "absolute";
					node.style.overflow = "hidden";
					node.style.width = element.width + 'px';
					node.style.height = element.height + 'px';
					node.style.top = element.top + 'px';
					node.style.left = element.left + 'px';
					node.style.position = "absolute";
					var page = document.getElementById('form' + formNumber + 'page' + element.page);
					page.appendChild(node);
				}
				deferred.resolve(formNumber);

			}, function (res) {
				snackbarContainer.MaterialSnackbar.showSnackbar(
					{ message: "Failed to load the form" });
			});
		return deferred.promise;
	}

	function getFormData() {
		vm.gridOptions.data = [];
		$http.get("http://localhost:3000/forms")
			.then(function (result) {
				vm.formsData = result.data;
				for (var i = 0; i < vm.formsData.length; i++) {
					var formData = vm.formsData[i];
					vm.gridOptions.data.push({
						"groupName": formData.groupName,
						"formName": formData.formName,
						"creationDate": formData.creationDate.substring(4, 25),
						"lastRecord": formData.lastRecord,
						"lastModified": formData.lastModified.substring(4, 25),
						"lastModifiedName": formData.lastModifiedName,
						"isImportant": formData.isImportant,
					});
				}
			}, function (result) {
				console.log("error: ", result);
			});
	}

	function createForm() {
		var formData = { groupName: vm.newFormGroup, formName: vm.newFormName };
		$http.post("http://localhost:3000/forms", { formData: formData }, { headers: { 'Content-Type': 'application/json' } })
			.then(function (res) {
				if (res.data === "Existed") {
					alert("This form name already exists in the selected group.");
				} else {
					$state.go('formBuilder', { groupName: res.data.groupName, formName: res.data.formName });
				}
			});
	}

	function deleteForms() {
		if (confirm("This will delete all the entries record of the selected forms. Do you want to continue?")) {
			angular.forEach(vm.gridApi.selection.getSelectedRows(), function (data, index) {
				$http.delete("http://localhost:3000/forms/" + data.groupName + '/' + data.formName)
					.then(function (res) {
						vm.gridOptions.data.splice(vm.gridOptions.data.lastIndexOf(data), 1);
						if (index === vm.gridApi.selection.getSelectedRows().length - 1) {
							vm.getFormData();
						}
					});
			});
			vm.gridApi.selection.clearSelectedRows();
		}
	}

	function renameForm() {
		var groupName = vm.gridApi.selection.getSelectedRows()[0].groupName;
		var renameFormOld = vm.gridApi.selection.getSelectedRows()[0].formName;
		$http.put("http://localhost:3000/forms/rename", { groupName: groupName, originalName: renameFormOld, newName: vm.renameFormNew }, { headers: { 'Content-Type': 'application/json' } })
			.then(function (res) {
				if (res.data === "Existed") {
					alert("This group name already exists");
				} else {
					vm.closeDialog('renameForm');
					vm.getFormData();
					snackbarContainer.MaterialSnackbar.showSnackbar(
						{ message: "Renamed the form" });
				}
			});
	}

	function duplicateForm() {
		var duplicateFrom = vm.gridApi.selection.getSelectedRows()[0].groupName;
		var formName = vm.gridApi.selection.getSelectedRows()[0].formName;
		$http.post("http://localhost:3000/forms/duplicate",
			{
				duplicateFrom: duplicateFrom,
				formName: formName,
				duplicateName: vm.duplicateName,
				duplicateTo: vm.duplicateTo
			},
			{ headers: { 'Content-Type': 'application/json' } })
			.then(function (res) {
				if (res.data === "Existed") {
					alert("This form name already exists.");
				} else if (res.data === "Cannot find") {
					alert("Cannot find the original form data");
				} else {
					vm.getFormData();
					vm.closeDialog('duplicateForm');
					vm.gridApi.selection.clearSelectedRows();
					snackbarContainer.MaterialSnackbar.showSnackbar(
						{ message: "Duplicated the form" });
				}
			});
	}

	function setImportant() {
		angular.forEach(vm.gridApi.selection.getSelectedRows(), function (data, index) {
			$http.put("http://localhost:3000/forms/important", { groupName: data.groupName, formName: data.formName }, { headers: { 'Content-Type': 'application/json' } })
				.then(function (res) {
					if (index === vm.gridApi.selection.getSelectedRows().length - 1) {
						vm.getFormData();
						vm.gridApi.selection.clearSelectedRows();
					}
				});
		});
	}

	function setNormal() {
		angular.forEach(vm.gridApi.selection.getSelectedRows(), function (data, index) {
			$http.put("http://localhost:3000/forms/normal", { groupName: data.groupName, formName: data.formName }, { headers: { 'Content-Type': 'application/json' } })
				.then(function (res) {
					if (index === vm.gridApi.selection.getSelectedRows().length - 1) {
						vm.getFormData();
						vm.gridApi.selection.clearSelectedRows();
					}
				});
		});
	}


	/* =========================================== UI grid =========================================== */
	vm.numberOfSelected = 0;
	$scope.msg = {};
	vm.gridOptions.onRegisterApi = function (gridApi) {
		vm.gridApi = gridApi;
	};
	vm.gridOptions.rowHeight = 30;

	vm.goEditForm = function (groupName, formName) {
		$state.go('formBuilder', { groupName: groupName, formName: formName });
	}

	function getTableHeight() {
		var rowHeight = 37; // your row height
		var headerHeight = 210; // your header height
		return {
			height: (vm.gridApi.core.getVisibleRows(vm.gridApi.grid).length * rowHeight + headerHeight) + "px"
		};
	};
	vm.gridOptions.showGridFooter = true;
	vm.gridOptions.enableColumnMenus = false;
	vm.gridOptions.enableGridMenu = true;
	vm.gridOptions.enableHorizontalScrollbar = 0;
	vm.gridOptions.enableVerticalScrollbar = 0;
	vm.gridOptions.enableSorting = true;
	vm.gridOptions.enableFiltering = true;
	vm.gridOptions.paginationPageSize = 10;
	vm.gridOptions.paginationPageSizes = [10, 25, 30, 50, 100, 250, 500, 1000, 5000, 10000];
	vm.gridOptions.enablePaginationControls = true;
	vm.gridOptions.columnDefs = [
		{
			name: 'groupName',
			displayName: 'Group Name',
			enableCellEdit: false,
			sort: {
				direction: uiGridConstants.ASC,
				priority: 0
			},
			resizable: true,
			cellTooltip: function (row, col) {
				return row.entity.groupName;
			}
		},
		{
			name: 'formName',
			displayName: 'Form Name',
			resizable: true,
			cellTemplate: '<a title="{{\'Proceed to edit: \'+row.entity.formName}}" ui-sref="formBuilder({groupName:row.entity.groupName,formName:row.entity.formName})" class="ui-grid-cell-contents">{{row.entity.formName}}</a>'
		},
		{
			name: 'isImportant',
			displayName: 'Importance',
			resizable: true
		},
		{
			name: 'creationDate',
			displayName: 'Creation Date',
			type: 'date',
			resizable: true,
			filters: [{
				condition: function (term, value) {
					if (!term) return true;
					var valueDate = new Date(value);
					var replaced = term.replace(/\\/g, '');
					var termDate = new Date(replaced);
					return valueDate > termDate;
				},
				placeholder: 'From:'

			}, {
					condition: function (term, value) {
						if (!term) return true;
						var valueDate = new Date(value);
						var replaced = term.replace(/\\/g, '');
						var termDate = new Date(replaced);
						termDate.setDate(termDate.getDate() + 1);
						return valueDate < termDate;
					},
					placeholder: 'To:'
				}],
			cellTooltip: function (row, col) {
				return row.entity.creationDate;
			}
		}, {
			name: 'creatorName',
			displayName: 'Creator',
			resizable: true,
			cellTooltip: function (row, col) {
				return row.entity.creatorName;
			}
		}, {
			name: 'lastRecord',
			displayName: 'Last Record',
			type: 'date',
			filters: [{
				condition: function (term, value) {
					if (!term) return true;
					var valueDate = new Date(value);
					var replaced = term.replace(/\\/g, '');
					var termDate = new Date(replaced);
					return valueDate > termDate;
				},
				placeholder: 'From:'

			}, {
					condition: function (term, value) {
						if (!term) return true;
						var valueDate = new Date(value);
						var replaced = term.replace(/\\/g, '');
						var termDate = new Date(replaced);
						termDate.setDate(termDate.getDate() + 1);
						return valueDate < termDate;
					},
					placeholder: 'To:'
				}],
			resizable: true,
			cellTooltip: function (row, col) {
				return row.entity.lastRecord;
			}
		}, {
			name: 'lastModified',
			displayName: 'Last Modified',
			type: 'date',
			cellFilter: 'date:"dd.MMM.yy"',
			resizable: true,
			filters: [{
				condition: function (term, value) {
					if (!term) return true;
					var valueDate = new Date(value);
					var replaced = term.replace(/\\/g, '');
					var termDate = new Date(replaced);
					return valueDate > termDate;
				},
				placeholder: 'From:'

			}, {
					condition: function (term, value) {
						if (!term) return true;
						var valueDate = new Date(value);
						var replaced = term.replace(/\\/g, '');
						var termDate = new Date(replaced);
						termDate.setDate(termDate.getDate() + 1);
						return valueDate < termDate;
					},
					placeholder: 'To:'
				}],
			cellTooltip: function (row, col) {
				return row.entity.lastModified;
			}
		}, {
			name: 'lastModifiedName',
			displayName: 'Last Modified By',
			resizable: true,
			cellTooltip: function (row, col) {
				return row.entity.lastModifiedName;
			}
		}];

	//sorting and filtering

	function showRecent() {
		if (vm.gridApi.grid.columns[7].filters[0].term) vm.gridApi.grid.columns[7].filters[0].term = '';
		else {
			var termDate = new Date();
			termDate.setDate(termDate.getDate() - 10);
			vm.gridApi.grid.columns[7].filters[0].term = termDate.toString().substring(4, 15);
		}
	}

	function showImportant() {
		if (vm.gridApi.grid.columns[3].filters[0].term !== 'Important') {
			vm.gridApi.grid.columns[3].filters[0] = {
				term: 'Important'
			};
		} else {
			vm.gridApi.grid.columns[3].filters[0] = {
				term: ''
			};
		}
	}

	function toggleImportantIcon() {
		if (vm.gridApi.grid.columns[3].filters[0].term == 'Important') {
			setNormal();
		} else {
			setImportant();
		}
	}


	/* =========================================== Dialog =========================================== */


	// Check if form name is duplicated. If yes, display feedback. Else, change name and close dialog.
	vm.openDialog = function (dialogName) {
		var dialog = document.querySelector('#' + dialogName);
		if (!dialog.showModal) {
			dialogPolyfill.registerDialog(dialog);
		}
		dialog.showModal();
	};

	vm.closeDialog = function (dialogName) {
		var dialog = document.querySelector('#' + dialogName);
		dialog.close();
	};

	/* =========================================== Load animation =========================================== */

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