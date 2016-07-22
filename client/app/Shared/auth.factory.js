(function () {
    'use strict';

	angular
		.module("app.shared")
		.factory("authServices", authServices);

	authServices.$inject = ['appConfig', 'feedbackServices', '$state', '$location','$cookies'];

	function authServices(appConfig, feedbackServices, $state, $location, $cookies) {
		var service = {
			logout: logout,
			getToken: getToken,
			deleteToken: deleteToken,
			decodeToken: decodeToken,
			getUserInfo: getUserInfo
		};
		return service;

		function logout() {
			deleteToken();
			return $state.go('login');
		}


		function getToken() {
			var cookie = $cookies.get('id');
			if (!cookie) logout();
			else {return cookie;}
		}

		function deleteToken() {
			return $cookies.remove('id');
		}

		function decodeToken(token) {
			var payload = token.split('.')[1];
			var decoded = JSON.parse(atob(payload));
			return decoded;
			
		}

		function getUserInfo() {
			var token = getToken();
			var userInfo = JSON.parse(JSON.stringify(decodeToken(token)));
			return {
				username: userInfo.username,
				email: userInfo.email,
				usertype: userInfo.usertype,
				companyName: userInfo.companyName,
				companyId: userInfo.companyId
			};
		}
	}
})();
