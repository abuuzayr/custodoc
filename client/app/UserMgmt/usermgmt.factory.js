(function () {
    'use strict';

    angular
        .module("app.core")
        .factory('usermgmtServices', usermgmtServices);

    usermgmtServices.$inject = ['$http','appConfig'];
    function usermgmtServices($http, appConfig){
    	var services = {
			getUsers: getUsers,
			createUser: createUser,
			updateUser: updateUser,
			deleteUser: deleteUser
    	};
    	return services;

    	function getUsers(){
    		return $http.get(appConfig.UM_URL);
    	}
    	function createUser(userData){
    		return $http.post(appConfig.UM_URL, userData);
    	}
    	function updateUser(userData){
    		return $http.put(appConfig.UM_URL + '/' + userData._id, userData);
    	}
    	function deleteUser(userId){
    		return $http.delete(appConfig.UM_URL + '/' + userId);
    	}
    }

    
})();    