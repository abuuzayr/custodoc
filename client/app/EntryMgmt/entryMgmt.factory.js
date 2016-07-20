angular.module('app.entryMgmt')
.factory('entryMgmtServices',entryMgmtServices);

entryMgmtServices.$inject = ['$http','appConfig'];
function entryMgmtServices($http,appConfig) {
	var service = {
		getData: getData,
	};

	return service;

	function getData(){
		return $http.get(appConfig.API_URL + '/protected/entries');
	}
}