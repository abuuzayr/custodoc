var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit','ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);

app.controller('MainCtrl',  ['$scope', '$http', '$q' , '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',function ($scope, $http, $q, uiGridConstants, uiGridGroupingConstants) {
	var vm = this;

	vm.query ='';
	vm.token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFubnkiLCJ1c2VybmFtZSI6ImRhbm55NDYiLCJpYXQiOjE0NjQ5Mjc0MDMsImV4cCI6MTQ2NTAxMzgwM30.ozq0nklQRWkx3J-bAlEGYqX5TsjGNMzxixH9e6wjrxw';
	var config = {headers:{ 'X-Access-Token': vm.token}};
	vm.baseURL = 'http://localhost:8001/api/autofill';

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

	vm.editRow = editRow;
	vm.deleteRow = deleteRow;
	
// ===========================================   	UI 	  	=========================================== //
vm.hasSelection = false;
		
// ===========================================   UI Buttons  =========================================== //
function gridRowClick(row){
	console.log(row);
}



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
		return vm.deleteOne(selectedId);
	return vm.deleteMany(selectedId);
};

vm.editRow = function(){

}

vm.exportCSV = function(){
	var element = angular.element(document.querySelectorAll('.custom-csv-link-location'));
    vm.gridApi.exporter.csvExport('selected', 'all', element );
};

vm.importCSV = function(){
};


	// ============================================== API ============================================== //





	vm.getCols = function(){
		var path = '/element';
		var url = vm.baseURL + path;
		vm.gridOptions.columnDefs = [];
		$http.get(url,config).then(function SuccessCallback(res){
				console.log(res.data);
				for(var i = 0; i < res.data.length; i++){
					vm.gridOptions.columnDefs.push({name: res.data[i].fieldname}); 
				}
				vm.gridOptions.columnDefs.push({
					name: ' ',
					enableCellEdit: false,
					allowCellFocus : false,
					cellTemplate:'cellTemplate.html'
				});
				return;
		}, function ErrorCallback(err){ 
				console.log(err);
				return;
		});        
	};
	//Entry CRUD

	vm.read = function(){
		vm.gridOptions.data = [];
		
		if(vm.query === ''){
			var url = vm.baseURL; 
		}
		else{
			var path = '/query/';
			var url = vm.baseURL + path + vm.query; 
		} 
		$http.get(url,config).success(function(data) {
			data.forEach(function(row){
				//vm.myData.push(row);
				vm.gridOptions.data.push(row);
		});
			console.log(vm.gridOptions.data);
		}).error(function(err) {
			console.log(err);
		});
	};

	vm.updateOne = function( rowEntity ) {

		var path = '/';
		var url = vm.baseURL + path + rowEntity._id
		var req = {
			method: 'PUT',
			url: url,
			headers:{ 
				'Content-type': 'application/json',
				'X-Access-Token': vm.token
			},
			data: rowEntity
		}
		var promise = $http(req);
	
		vm.gridApi.rowEdit.setSavePromise(rowEntity, promise)
	};

	vm.deleteOne = function(selectedId){
		var path = '/';
		var url = vm.baseURL + path + selectedId
		var req = {
			method: 'DELETE',
			url: url,
			headers:{ 'X-Access-Token': vm.token},
			data: rowEntity 
		}

		$http(req).success(function(data){
				vm.clearSelected();
				console.log('delete response: ');
				console.log(data);
			}).error(function(err){
				console.log(err);
			});
	};
	
	vm.deleteMany = function(rgSelectedId){
			console.log(rgSelectedId);

			var path = '/';
			var url = vm.baseURL + path
			var req = {
			 method: 'DELETE',
			 url: url,
			 headers:{ 'X-Access-Token': vm.token},
			 params: { id: rgSelectedId }
			}

			$http(req).success(function(data){
				vm.clearSelected();
				console.log('delete response: ');
				console.log(data);
			}).error(function(err){
				console.log(err);
			});
	};

	vm.getCols();

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
				vm.updateOne);
	};
	
}]);
