(function () {
    'use strict';

	angular
		.module("app.shared")
		.factory("authServices", authServices)

	authServices.$inject = ['appConfig', 'feedbackServices', '$state', '$location','$cookies'];

	function authServices(appConfig, feedbackServices, $state, $location, $cookies) {
		var service = {
			logout: logout,
			getToken: getToken,
			deleteToken: deleteToken,
			decodeToken: decodeToken,
			getUserInfo: getUserInfo
		}
		return service;

		function logout() {
			deleteToken();
			return $state.go('login');
		}


		function getToken() {
			return $cookies.get('access-token')
		}

		function deleteToken() {
			return $cookies.remove('access-token');
		}

		function decodeToken(token) {
			if (!token) {
				return feedbackServices.hideFeedback('login-feedbackMessage')
				.then(feedbackServices.errorFeedback( 'Not Athenticated, Logging out' , 'login-feedbackMessage'))
				.then(function delayLogout(){
					setTimeout(function() {
						logout()
					}, 2000);
				});
			}
			var payload = token.split('.')[1];
			var decoded = JSON.parse(atob(payload));
			return decoded;
		}

		function getUserInfo() {
			var token = getToken();
			var userInfo = JSON.parse(JSON.stringify(decodeToken(token)));
			console.log(token);
			console.log(userInfo);
			return {
				username: userInfo.username,
				email: userInfo.email,
				usertype: userInfo.usertype
			};
		}
	}
})();