var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);

app.controller('MainCtrl',  ['$scope', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',function ($scope, $http, uiGridConstants, uiGridGroupingConstants) {
  $scope.query ='';
  $scope.token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFubnkiLCJ1c2VybmFtZSI6ImRhbm55NDYiLCJpYXQiOjE0NjQyMjY2NDIsImV4cCI6MTQ2NDMxMzA0Mn0.zZd4BStQcbVpFKXfsLYe1slZ_udFsbocCxS-QAqK5bQ';
  var config = {headers:{ 'X-Access-Token': $scope.token}};

  $scope.gridOptions = {};
  $scope.gridOptions.data = 'myData';
  $scope.gridOptions.columnDefs = [];

  $scope.gridOptions.enableColumnResizing = true;
  $scope.gridOptions.enableFiltering = true;
  $scope.gridOptions.enableGridMenu = true;
  $scope.gridOptions.showGridFooter = true;
  $scope.gridOptions.showColumnFooter = true;
  $scope.gridOptions.fastWatch = true;
  $scope.gridOptions.multiSelect = true;
  $scope.gridOptions.gridMenuShowHideColumns = false;

  $scope.deleteSelectedRows = function() {
    var selectedRows = $scope.gridApi.selection.getSelectedRows();
    var selectedId = [];
    for(var i = 0 ; i < selectedRows.length ; i++){
      selectedId.push(selectedRows[i]._id);
      $scope.myData.splice($scope.myData.indexOf(selectedRows[i]), 1);
    }
    $scope.delete(selectedId);
  };


  $scope.getCols = function(){
    var baseUrl = "http://localhost:8001/api/autofill/element";
    $scope.gridOptions.columnDefs = [];
    $http.get(baseUrl,config).then(function SuccessCallback(res){
        console.log(res.data);
        for(var i = 0; i < res.data.length; i++){
            $scope.gridOptions.columnDefs.push({name: res.data[i].fieldname}); 
        }
        $scope.gridOptions.columnDefs.push({
            name: 'Action',
            enableCellEdit: false,
            cellTemplate: '<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--mini-fab mdl-button--colored mdl-js-ripple-effect" ng-click="grid.appScope.Delete(row)">Delete</button>'
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
    var baseUrl = "http://localhost:8001/api/autofill/query/";
    var url = baseUrl + $scope.query;
    console.log(url)  
    $http.get(url,config).success(function(data) {
      data.forEach(function(row){
        $scope.myData.push(row);
    });
      console.log($scope.myData);
    }).error(function(err) {
      console.log(err);
    });

  };

  $scope.update = function(){

  };

  $scope.delete = function(selectedId){
      console.log(selectedId);
      //var config = {headers:{ 'X-Access-Token': $scope.token},data: selectedId};
      var baseUrl = "http://localhost:8001/api/autofill/";

      var req = {
       method: 'DELETE',
       url: baseUrl,
       headers:{ 'X-Access-Token': $scope.token},
       params: { id: selectedId },
      }



      
      $http(req).success(function(data){
        console.log("delete response: ");
        console.log(data);
      }).error(function(err){
        console.log(err);
      });
  };

  $scope.getCols();

  //Additional
  $scope.gridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi;      
  };
  
}]);
