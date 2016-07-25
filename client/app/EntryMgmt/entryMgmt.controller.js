(function(){
	"use strict";
angular.module('app.entryMgmt')
.controller('entryMgmtCtrl',entryMgmtCtrl);

	entryMgmtCtrl.$inject = ['$scope','$q','$timeout','entryMgmtServices'];
	function entryMgmtCtrl($scope, $q, $timeout,entryMgmtServices){
		var vm = this;
		var fieldArray = ['groupName','formName','createdAt','createdBy','lastModifiedAt','lastModifiedBy','_id'];
		vm.tableOptions = {};
		vm.tableOptions.data = [];
		vm.tableOptions.columnDefs = [];
		vm.tableOptions.enableMultiSelect = true;
		vm.tableOptions.enablePagination = true;
		vm.tableOptions.enableEdit = true;
		vm.tableOptions.enableDelete = true;
		vm.tableOptions.enableExport = true;
		vm.tableOptions.enableImport = true;
		//
		vm.tableOptions.importFunc = importFunc;
		vm.tableOptions.saveFunc = updateRow;
		getData();

		function getData(){
			return entryMgmtServices.getData()
			.then(SuccessCallback)
			.catch(ErrorCallback);

			function SuccessCallback(res){
				vm.tableOptions.data = [];
				vm.tableOptions.data = res.data;
				vm.tableOptions.columnDefs = [];
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Group Name', fieldName: 'groupName'});
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Form Name', fieldName: 'formName'});
				vm.tableOptions.columnDefs.push({type:'date', displayName:'Created at', fieldName: 'createdAt', format:'MMM d, y'});
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Created by', fieldName: 'createdBy'});
				vm.tableOptions.columnDefs.push({type:'date', displayName:'Last edit', fieldName: 'modifiedAt', format:'MMM d, y'});
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Edited by', fieldName: 'modifiedBy'});
				for(var i = 0 ; i  < vm.tableOptions.data.length; i++){
					for(var fieldName in vm.tableOptions.data[i].data){
						vm.tableOptions.data[i][fieldName] = vm.tableOptions.data[i].data[fieldName];
						if(!fieldName.startsWith('image_') && !fieldName.startsWith('signature_')){
							vm.tableOptions.columnDefs.push({
								type:'default', 
								displayName: getDisplayName(fieldName),
								fieldName: fieldName,
								enableEdit: true
							});
						}
					}
					delete vm.tableOptions.data[i].data;
				}
				
				vm.tableOptions.columnDefs.push({type:'action', icon:'get_app', action:downLoadAsOne});
			}
			function ErrorCallback(err){
				console.log(err);
			}

			function getDisplayName(fieldName) {
				if(fieldName.startsWith('text_')){
					return fieldName.replace('text_','');
				}else if (fieldName.startsWith('checkbox_')){
					return fieldName.replace('checkbox_','');
				}else if (fieldName.startsWith('dropdown_')){
					return fieldName.replace('dropdown_','');
				}else if (fieldName.startsWith('radio')){
					return fieldName.replace('radio','');
				}else
					return fieldName;
			}
		}

		function downLoadAsOne(row){
			var pdf = new jsPDF();
			var deferred = $q.defer();
			deferred.resolve(1);
			var p = deferred.promise;
			p = p.then(function (formNumber) { return generateForm(formNumber); });
			p = p.then(function (formNumber) { return generateImage(formNumber); });
			p.then(function () {
				for (var j = 0; j < pagesImage.length; j++) {
					for (var k = 0; k < pagesImage[j].length; k++) {
						if (j !== 0 || k !== 0){
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


		function importFunc(rowArray){
			var deferred = $q.defer();
			var saveAll = [];
			//promise chaining
			for(var i = 0 ; i < rowArray.length; i++){
				saveAll.push(saveRow(rowArray[i]));
			}

			$q.all(saveAll).then(function resolve(){
			  deferred.resolve('all saved');
			}, function reject(err){
			  deferred.reject(err);
			});

			return deferred.promise;
		}

		function saveRow(row){
			var deferred = $q.defer();
			entryMgmtServices.saveData(row)
			.then(successCallback)
			.catch(errorCallback);
			return deferred.promise;

			function successCallback(msg){
				vm.tableOptions.data.unshift(row);
				deferred.resolve(msg);
			}
			
			function errorCallback(err){
				deferred.reject(err);
			}
		}

		function updateRow(row){
			var rowData = row;
			var data = {};
			var deferred = $q.defer();	
			for(var field in rowData){
				if(fieldArray.indexOf(field) === -1){
					data[field] = rowData[field];
					delete rowData[field];
				}
			}
			rowData.data = data;

			console.log(rowData);
			entryMgmtServices.updateData(rowData)
			.then(successCallback)
			.catch(errorCallback);
			return deferred.promise;

			function successCallback(msg){
				deferred.resolve(msg);
			}
			
			function errorCallback(err){
				deferred.reject(err);
			}
		}

		//UPGRADE UI
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
