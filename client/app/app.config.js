angular.module('app.core')
	.constant('appConfig', {
		APP_VERSION: '0.1',
		API_URL: '//app.bulletforms.com/api',
		AUTH_URL:'//app.bulletsuite.com/api/auth/user',
		FP_URL: '//app.bulletsuite.com/api/forgetpassword/user',
		UM_URL: '//app.bulletsuite.com/api/usermgmt/',
		MIN_PASSWORD_LENGTH:8,
		MAX_PASSWORD_LENGTH:24
	});
