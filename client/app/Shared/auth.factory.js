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
			console.log($cookies.get('id'));
			return $cookies.get('id');
		}

		function deleteToken() {
			return $cookies.remove('id');
		}

		function decodeToken(token) {
			console.log(token);
			if (!token)
				console.log('no cookie');//	return logout();
			var payload = token.split('.')[1];
			var decoded = JSON.parse(atob(payload));
			return decoded;
		}

		function getUserInfo() {
			var token = getToken();
			var userInfo = JSON.parse(JSON.stringify(decodeToken(token)));
			console.log('Auth get token:' + token);
			console.log('Auth get user info:' + userInfo);
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
