(function() {
	  "use strict";

angular.module('app.autofill')
	.service('autofillServices',autofillServices)

	autofillServices.$inject = ['$http', 'appConfig'];
	function autofillServices($http, appConfig){
		
		this.getElement = function(){
			var path = '/protected/autofill/element';
			return $http.get(appConfig.API_URL + path);
		}

		this.getRecords = function(query){
			
			if(query === ''||query == undefined||query == null){
				var path = '/protected/autofill'
				return $http.get(appConfig.API_URL + path);
			}else{
				var path = '/protected/autofill/query'
				return $http.get(appConfig.API_URL + path + '/' + query);
			} 

		}

		this.updateRecord = function(rowEntity){
			var path = '/protected/autofill/';
			var req = {
					method: 'PUT',
					url: appConfig.API_URL + path + rowEntity._id,
					headers: { 'Content-type': 'application/json' },
					data: rowEntity
				}
			return $http(req);	
		}

		this.createRecord = function(rowEntity){
			var path = '/protected/autofill/';
			var req = {
				method: 'POST',
				url: appConfig.API_URL + path,
				data: {recordData: rowEntity} 
			}
			return $http(req);
		}




		this.deleteOneRecord = function(selectedId){
			var path = '/protected/autofill/';
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + path + selectedId,
				data: selectedId 
			}

			return $http(req);
		}

		this.deleteRecords = function( rgSelectedId ){
			var path = '/protected/autofill';
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + path,
				params: { id: rgSelectedId }
			}

			return $http(req);
		}

		this.createElement = function(elementData){
			var path = '/protected/autofill/element';
			var req = {
					method: 'POST',
					url: appConfig.API_URL + path,
					headers: { 'Content-type': 'application/json' },	
					data: {elementData: elementData}
				}
			return $http(req);	
		}
	}


})();