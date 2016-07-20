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
			var path = '/protected/autofill/element';
			return $http.get(appConfig.API_URL + path);
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
			var path = '/protected/autofill/';
			var req = {
					method: 'PUT',
					url: appConfig.API_URL + path + rowEntity._id,
					headers: { 'Content-type': 'application/json' },
					data: rowEntity
				};
			return $http(req);	
		}

		function createRecord(rowEntity){
			var path = '/protected/autofill/';
			var req = {
				method: 'POST',
				url: appConfig.API_URL + path,
				data: {recordData: rowEntity} 
			};
			return $http(req);
		}


		function deleteOneRecord(selectedId){
			var path = '/protected/autofill/';
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + path + selectedId,
				data: selectedId 
			};

			return $http(req);
		}

		function deleteRecords( rgSelectedId ){
			var path = '/protected/autofill';
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + path,
				params: { id: rgSelectedId }
			};

			return $http(req);
		}

		function createElement(elementData){
			var path = '/protected/autofill/element';
			var req = {
					method: 'POST',
					url: appConfig.API_URL + path,
					headers: { 'Content-type': 'application/json' },	
					data: {elementData: elementData}
				};
			return $http(req);	
		}
	}


})();