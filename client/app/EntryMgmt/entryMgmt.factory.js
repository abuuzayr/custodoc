(function(){
	"use strict";
angular.module('app.entryMgmt')
.factory('entryMgmtServices',entryMgmtServices);

entryMgmtServices.$inject = ['$http','appConfig'];
function entryMgmtServices($http,appConfig) {
	var service = {
		getData: getData,
		saveData: saveData,
		updateData: updateData,
		getFormGroupData: getFormGroupData
	};
	return service;

	function getData(){
		return $http.get(appConfig.API_URL + '/protected/entries');
	}

	function saveData(rowData){
		return $http.post(appConfig.API_URL + '/protected/entries', {
			rowData: rowData
		});
	}

	function updateData(rowData){
		return $http.put(appConfig.API_URL + '/protected/entries/' + rowData._id, {
			entryData: rowData
		});
	}

	function getFormGroupData(groupName){
		return $http.get(appConfig.API_URL +'/protected/groups/getGroupForms/'+groupName);
	}

}
})();
