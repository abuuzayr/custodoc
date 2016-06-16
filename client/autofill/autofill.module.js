var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit','ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);

app.controller('MainCtrl',  ['$scope', '$http', '$q' , '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',function ($scope, $http, $q, uiGridConstants, uiGridGroupingConstants) {
	$scope.query ='';
	$scope.token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFubnkiLCJ1c2VybmFtZSI6ImRhbm55NDYiLCJpYXQiOjE0NjQ5Mjc0MDMsImV4cCI6MTQ2NTAxMzgwM30.ozq0nklQRWkx3J-bAlEGYqX5TsjGNMzxixH9e6wjrxw';
	$scope.myData = [];
	var config = {headers:{ 'X-Access-Token': $scope.token}};
	$scope.baseURL = 'http://localhost:8001/api/autofill';

	$scope.gridOptions = {};
	$scope.gridOptions.data = 'myData';
	$scope.gridOptions.columnDefs = [];
	$scope.gridOptions.rowHeight = 50;
	$scope.gridOptions.enableColumnResizing = true;
	$scope.gridOptions.enableFiltering = true;
	$scope.gridOptions.enableGridMenu = true;
	$scope.gridOptions.showGridFooter = false;
	$scope.gridOptions.showColumnFooter = false;
	$scope.gridOptions.fastWatch = true;
	$scope.gridOptions.multiSelect = true;
	$scope.gridOptions.gridMenuShowHideColumns = false;
	$scope.gridOptions.importerShowMenu = false;
	
// ===========================================   	UI 	  	=========================================== //
$scope.hasSelection = false;
		
// ===========================================   UI Buttons  =========================================== //

$scope.clearSelected = function() {
	$scope.gridApi.selection.clearSelectedRows();
	$scope.hasSelection = false;
};

$scope.deleteSelected = function() {
	var selectedRows = $scope.gridApi.selection.getSelectedRows();
	var selectedId = [];
	for(var i = 0 ; i < selectedRows.length ; i++){
		selectedId.push(selectedRows[i]._id);
		$scope.myData.splice($scope.myData.indexOf(selectedRows[i]), 1);
	}
	if(selectedId.length === 1)
		return $scope.deleteOne(selectedId);
	return $scope.deleteMany(selectedId);
};

$scope.editRow = function(){

}

$scope.exportCSV = function(){
	var element = angular.element(document.querySelectorAll('.custom-csv-link-location'));
    $scope.gridApi.exporter.csvExport('selected', 'all', element );
};

$scope.importCSV = function(){
};


	// ============================================== API ============================================== //





	$scope.getCols = function(){
		var path = '/element';
		var url = $scope.baseURL + path;
		$scope.gridOptions.columnDefs = [];
		$http.get(url,config).then(function SuccessCallback(res){
				console.log(res.data);
				for(var i = 0; i < res.data.length; i++){
					$scope.gridOptions.columnDefs.push({name: res.data[i].fieldname}); 
				}
				$scope.gridOptions.columnDefs.push({
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

	$scope.read = function(){
		$scope.myData = [];
		
		if($scope.query === ''){
			var url = $scope.baseURL; 
		}
		else{
			var path = '/query/';
			var url = $scope.baseURL + path + $scope.query; 
		} 
		$http.get(url,config).success(function(data) {
			data.forEach(function(row){
				$scope.myData.push(row);
		});
			console.log($scope.myData);
		}).error(function(err) {
			console.log(err);
		});
	};

	$scope.updateOne = function( rowEntity ) {

		var path = '/';
		var url = $scope.baseURL + path + rowEntity._id
		var req = {
			method: 'PUT',
			url: url,
			headers:{ 
				'Content-type': 'application/json',
				'X-Access-Token': $scope.token
			},
			data: rowEntity
		}
		var promise = $http(req);
	
		$scope.gridApi.rowEdit.setSavePromise(rowEntity, promise)
	};

	$scope.deleteOne = function(selectedId){
		var path = '/';
		var url = $scope.baseURL + path + selectedId
		var req = {
			method: 'DELETE',
			url: url,
			headers:{ 'X-Access-Token': $scope.token},
			data: rowEntity 
		}

		$http(req).success(function(data){
				$scope.clearSelected();
				console.log('delete response: ');
				console.log(data);
			}).error(function(err){
				console.log(err);
			});
	};
	
	$scope.deleteMany = function(rgSelectedId){
			console.log(rgSelectedId);

			var path = '/';
			var url = $scope.baseURL + path
			var req = {
			 method: 'DELETE',
			 url: url,
			 headers:{ 'X-Access-Token': $scope.token},
			 params: { id: rgSelectedId }
			}

			$http(req).success(function(data){
				$scope.clearSelected();
				console.log('delete response: ');
				console.log(data);
			}).error(function(err){
				console.log(err);
			});
	};

	$scope.getCols();

	//Additional
	$scope.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope,function(row){
				if($scope.gridApi.grid.selection.selectedCount)
					$scope.hasSelection = true;
				else
					$scope.hasSelection = false;
			});
 
			gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
				if($scope.gridApi.grid.selection.selectedCount)
					$scope.hasSelection = true;
				else
					$scope.hasSelection = false;
			});

			gridApi.rowEdit.on.saveRow($scope, 
				$scope.updateOne);
	};
	
}]);
