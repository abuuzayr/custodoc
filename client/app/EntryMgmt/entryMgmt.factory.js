angular.module('app.entryMgmt')
.factory('entryMgmtServices',entryMgmtServices);

entryMgmtServices.$inject = ['$http','dataTableServices','appConfig'];
function entryMgmtServices($http,dataTableServices,appConfig) {
	var service = {
		tableDataConstructor: tableDataConstructor,
		getData: getData,
		getPagination: getPagination
	};

	return service;

	function tableDataConstructor(data){
		return dataTableServices.getDataSchema(data);
	}

	function getData(){
		return $http.get(appConfig.API_URL + '/protected/entries');
	}

	function getPagination(tableOptions){
		console.log(tableOptions);
		var pagination = tableOptions.pagination;
		pagination.totalItem = tableOptions.tableData.data.length;
		pagination.totalPage = Math.ceil(tableOptions.pagination.totalItem/tableOptions.pagination.itemPerPage);
		pagination.currentPage = 1;
		pagination.rgPage = new Array(tableOptions.pagination.totalPage);
		return pagination;
	}
}