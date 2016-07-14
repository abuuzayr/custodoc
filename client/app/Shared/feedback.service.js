(function () {
    'use strict';

	angular
		.module('app.shared')
		.service('feedbackServices', feedbackServices);

	feedbackServices.$inject = ['$q', '$timeout'];

	function feedbackServices($q, $timeout) {

		this.errorFeedback = function (errData, domElementId) {
			var snackbarContainer = document.querySelector('#' + domElementId);
			if(snackbarContainer.classList){
				snackbarContainer.classList.remove("mdl-snackbar--active");
				snackbarContainer.MaterialSnackbar.active = false;//
			}
			
			var errMsg = '';
			if( (typeof errData) === 'string')
				errMsg = errData;
			else 
				errMsg = errData ? errData.description : "Connection error with server";
			var feedback = {
				message: errMsg,
				timeout: 5000
			};
			snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
			var deferred = $q.defer();
			deferred.resolve('ok');
			return deferred.promise;
		};

		this.successFeedback = function (msg, domElementId, timeout) {
			var snackbarContainer = document.querySelector('#' + domElementId);
			if(snackbarContainer.classList){
				snackbarContainer.classList.remove("mdl-snackbar--active");
				snackbarContainer.MaterialSnackbar.active = false;//
			}//
			var feedback = {
				message: msg,
				timeout: timeout ? timeout : 5000
			};
			snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
			var deferred = $q.defer();
			deferred.resolve('ok');
			return deferred.promise;
		};

	}
} ());
	
