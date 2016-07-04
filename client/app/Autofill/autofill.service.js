angular.module('app.autofill')
	.service('autofillServices',autofillServices)

	autofillServices.$inject = ['$http', 'appConfig']
	function autofillServices($http, appConfig){
		
		this.getElement = function(){
			var path = '/protected/autofill/element';
			return $http.get(appConfig.API_URL + path,{
				headers:{ 'X-Access-Token': appConfig.TOKEN }
			})
		}

		this.getRecords = function(query){
			
			if(query === ''){
				var path = '/protected/autofill'
				return $http.get(appConfig.API_URL + path, {
					headers:{ 'X-Access-Token': appConfig.TOKEN }
				})
			}
			else{
				var path = '/protected/autofill/query'
				return $http.get(appConfig.API_URL + path + '/' + query, {
					headers:{ 'X-Access-Token': appConfig.TOKEN } 
				})
			} 

		}

		this.updateRecord = function(rowEntity){
			var path = '/protected/autofill/';
			var req = {
					method: 'PUT',
					url: appConfig.API_URL + path + rowEntity._id,
					headers:
					{ 
						'Content-type': 'application/json',
						'X-Access-Token': appConfig.TOKEN 
					},
					data: rowEntity
				}
			return $http(req);	
		}

		this.createRecord = function(rowEntity){
			var path = '/protected/autofill/';
			var req = {
				method: 'POST',
				url: appConfig.API_URL + path,
				headers:{ 'X-Access-Token': appConfig.TOKEN },
				data: {recordData: rowEntity} 
			}
			return $http(req);
		}




		this.deleteOneRecord = function(selectedId){
			var path = '/protected/autofill/';
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + path + selectedId,
				headers:{ 'X-Access-Token': appConfig.TOKEN },
				data: selectedId 
			}

			return $http(req);
		}

		this.deleteRecords = function( rgSelectedId ){
			var path = '/protected/autofill';
			var req = {
				method: 'DELETE',
				url: appConfig.API_URL + path,
				headers:{ 'X-Access-Token': appConfig.TOKEN},
				params: { id: rgSelectedId }
			}

			return $http(req);
		}

		this.createElement = function(elementData){
			var path = '/protected/autofill/element';
			var req = {
					method: 'POST',
					url: appConfig.API_URL + path,
					headers:
					{ 
						'Content-type': 'application/json',
						'X-Access-Token': appConfig.TOKEN 
					},
					data: {elementData: elementData}
				}
			return $http(req);	
		}
	}