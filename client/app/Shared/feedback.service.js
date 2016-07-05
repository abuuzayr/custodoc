(function () {
    'use strict';

	angular
		.module('app.shared')
		.service('feedbackServices', feedbackServices);

	feedbackServices.$inject = ['$q', '$timeout'];

	function feedbackServices($q, $timeout) {

		this.errorFeedback = function (errData, domElementId) {
			var snackbarContainer = document.querySelector('#' + domElementId);
			snackbarContainer.classList.remove("mdl-snackbar--active");
			snackbarContainer.MaterialSnackbar.active = false;//
			
			var errMas = ''
			if( (typeof errData) === 'string')
				errMsg = errData;
			else 
				errMsg = errData ? errData.description : "Connection error with server";
			var feedback = {
				message: errMsg,
				timeout: 5000
			}
			snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
			return $q.defer().promise;
		}

		this.successFeedback = function (msg, domElementId, timeout) {
			var snackbarContainer = document.querySelector('#' + domElementId);
			snackbarContainer.classList.remove("mdl-snackbar--active");
			snackbarContainer.MaterialSnackbar.active = false;//
			var feedback = {
				message: msg,
				timeout: timeout ? timeout : 5000
			}
			snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
			return $q.defer().promise;
		}

		// this.hideFeedback = function (domElementId) {
		// 	var snackbarContainer = document.querySelector(domElementId);
		// 	return $q.defer().promise;
		// }
	}
} ());
	