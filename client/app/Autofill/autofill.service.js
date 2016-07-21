(function() {
	  "use strict";

angular.module('app.autofill')
	.factory('autofillServices',autofillServices);

	autofillServices.$inject = ['$http', 'appConfig'];
	function autofillServices($http, appConfig){
		var services = {
			getElement : getElement,
			getRecords : getRecords,
			updateRecord : updateRecord,
			createRecord : createRecord,
			deleteOneRecord : deleteOneRecord,
			deleteRecords : deleteRecords,
			createElement : createElement
		};
		return services;


		function getElement(){
			return $http.get(appConfig.API_URL + '/protected/autofill/element');
		}

		function getRecords(query){
			var path = '';
			if(query === ''||query === undefined||query === null){
				path = '/protected/autofill';
				return $http.get(appConfig.API_URL + path);
			}else{
				path = '/protected/autofill/query';
				return $http.get(appConfig.API_URL + path + '/' + query);
			} 

		}

		function updateRecord(rowEntity){
			var req = {
					method: 'PUT',
					url: appConfig.API_URL + '/protected/autofill/' + rowEntity._id,
					headers: { 'Content-type': 'application/json' },
					data: rowEntity
				};
			return $http(req);	
		}

		function createRecord(rowEntity){
			var req = {
				method: 'POST',
				url: appConfig.API_URL + '/protected/autofill/',
				data: {recordData: rowEntity} 
			};
			return $http(req);
		}


		function deleteOneRecord(selectedId){
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + '/protected/autofill/' + selectedId,
				data: selectedId 
			};

			return $http(req);
		}

		function deleteRecords( rgSelectedId ){
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + '/protected/autofill/',
				params: { id: rgSelectedId }
			};

			return $http(req);
		}

		function createElement(elementData){
			var req = {
					method: 'POST',
					url: appConfig.API_URL + '/protected/autofill/element',
					headers: { 'Content-type': 'application/json' },	
					data: {elementData: elementData}
				};
			return $http(req);	
		}
	}
})();