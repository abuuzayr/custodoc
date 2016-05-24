var app = angular.module('autofill',['smart-table']);

// app.config(['$httpProvider',function ($httpProvider) {
//     $httpProvider.defaults.headers.common = { 'X-Access-Token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFubnkiLCJ1c2VybmFtZSI6ImRhbm55NDYiLCJpYXQiOjE0NjQwNjIxNjksImV4cCI6MTQ2NDE0ODU2OX0.8JeusWcseLofWHBHT0uyGXwMH5VT3NIK7MTczBCijfU' };
// }]);

app.controller('autofill.controller',['$http','$scope',function($http,$scope){
///////////////////
	$scope.query ='';
	$scope.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFubnkiLCJ1c2VybmFtZSI6ImRhbm55NDYiLCJpYXQiOjE0NjQwNjIxNjksImV4cCI6MTQ2NDE0ODU2OX0.8JeusWcseLofWHBHT0uyGXwMH5VT3NIK7MTczBCijfU';
	var dataset = [];
	var config = {headers:{ 'X-Access-Token': $scope.token}};

	$scope.rowCollection = [];
	
    //remove to the real data holder
    $scope.removeItem = function removeItem(row) {
        var index = $scope.rowCollection.indexOf(row);
        if (index !== -1) {
            $scope.rowCollection.splice(index, 1);
        }
    }

   
    //read all function
    $scope.readAll = function(){
        var baseUrl = "http://localhost:8001/autofill/query";
        var url = baseUrl + $scope.query;
        
        $http.get(url,config).then(function SuccessCallback(res){
  
            dataset = [];
            dataset = res.data;
            $scope.refresh();
            console.log($scope.rowCollection);
            return;
        }, function ErrorCallback(err){
 
            console.log(err);
            return;
        });
    };

    $scope.refresh = function(){
    	$scope.rowCollection = [];
    	for (var i = 0; i < dataset.length; i++){
 			$scope.rowCollection.push(dataset[i]);
 		}
    }

    $scope.readAll();

//////////////////	
}]);

