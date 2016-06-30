angular.module('autofillApp')
	.service('feedbackServices',feedbackServices)

	feedbackServices.$inject = ['$q','$timeout'];
	function feedbackServices($q, $timeout){
		
		this.errorFeedback = function(msg,domElementId,timeout){	
			var errMsg = msg ? msg : "null returned from server";
			var feedback = {
				message: errMsg,
				timeout: timeout ? timeout:5000
			}
			var snackbarContainer = document.querySelector('#'+ domElementId);
			snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
		}

		this.successFeedback = function(msg,domElementId,timeout){
			var defer = $q.defer();
			var feedback = {
				message: msg,
				timeout: timeout ? timeout:5000
			}
			var snackbarContainer = document.querySelector('#' + domElementId);//
			snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
			return $q.defer().promise;
		}

		this.hideFeedback = function(domElementId){
			var snackbarContainer = document.querySelector('#'+domElementId);
				snackbarContainer.classList.remove("mdl-snackbar--active");
				snackbarContainer.MaterialSnackbar.active = false;
				return $q.defer().promise;
		}
	}
	