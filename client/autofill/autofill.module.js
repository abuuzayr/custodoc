var app = angular.module('autofill',['smart-table']);

app.controller('autofill.controller',['$http','$scope',function($http,$scope){

	$scope.query ='';
	$scope.token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFubnkiLCJ1c2VybmFtZSI6ImRhbm55NDYiLCJpYXQiOjE0NjQxNDMyNTAsImV4cCI6MTQ2NDIyOTY1MH0.P_923lLVh-twEJLrCIgUZWPPDKlxttqjupTp1gbF5kY';
    $scope.columns = [];
    $scope.rowCollection = [];

    var dataset = [];
	var config = {headers:{ 'X-Access-Token': $scope.token}};
    //remove to the real data holder
    $scope.removeItem = function(row) {
        var index = $scope.rowCollection.indexOf(row);
        if (index !== -1) {
            $scope.rowCollection.splice(index, 1);
        }
    };
    //get columns from db
    $scope.getCols = function(){
        var baseUrl = "http://localhost:8001/api/autofill/element";
        var url = baseUrl + $scope.query;
        $scope.columns = [];
        $http.get(url,config).then(function SuccessCallback(res){
            console.log(res.data);
            for(var i = 0; i < res.data.length; i++){
                $scope.columns.push(res.data[i].fieldname); 
            }
            return;
        }, function ErrorCallback(err){ 
            console.log(err);
            return;
        });        
    }
    //get records from db
    $scope.getRecords = function(){
        var baseUrl = "http://localhost:8001/api/autofill/query/";
        var url = baseUrl + $scope.query;
        
        $http.get(url,config).then(function SuccessCallback(res){
            dataset = [];
            dataset = res.data;
            console.log(dataset);
            $scope.refresh();
            return;
        }, function ErrorCallback(err){
 
            console.log(err);
            return;
        });
    };
    //push data into table
    $scope.refresh = function(){
    	$scope.rowCollection = [];
    	for (var i = 0; i < dataset.length; i++){
 			$scope.rowCollection.push(dataset[i]);
 		}
    };

    $scope.getCols();
    $scope.getRecords();

    //////////////////	
    
}]);

