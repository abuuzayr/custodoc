angular
	.module('app',[])
	.controller('appCtrl',[ "$scope", "$q", "$timeout", function ($scope, $q, $timeout) {
		var vm = this;
		vm.wrapper = angular.element(document.getElementById('signature-field-div'));
		vm.dialog = angular.element(vm.wrapper.find('dialog'))[0];
		vm.canvas = angular.element(vm.wrapper.find('canvas'))[0];
		vm.signaturePad = new SignaturePad(vm.canvas);
		// Clears the canvas
		vm.openModal = function(){
			vm.dialog.showModal();	
		}
		
		vm.closeModal = function(){
			vm.dialog.close();	
		}

		vm.clear = function(){
			vm.signaturePad.clear();
		};

		vm.save = function(){
			console.log('haha');
			if (vm.signaturePad.isEmpty()) {
        		var msg = "Please provide signature first.";
        		showSnackbar(msg);
   		 	} else {
   		 		var dataURL = vm.signaturePad.toDataURL('image/png',1);
   		 		//Open image in new window
    			//window.open(dataURL);
				//..or
				//Extract as base64 encoded
				var data = dataURL.substr(dataURL.indexOf('base64') + 7)
				console.log(data);
				//TODO: include in your json object
    		}
		}


		/* =========================================== Load animation =========================================== */
		var viewContentLoaded = $q.defer();
		$scope.$on('$viewContentLoaded', function () {
			$timeout(function () {
				viewContentLoaded.resolve();
			}, 0);
		});
		viewContentLoaded.promise.then(function () {
			$timeout(function () {
				componentHandler.upgradeDom();
			}, 0);
		});

		/* =========================================== Snackbar =========================================== */
		function showSnackbar(msg) {
			var msgSnackbar = {
				message: msg,
				timeout: 5000
			}
			var snackbarContainer = document.querySelector('#snackbar-div');
			console.log(snackbarContainer);
			snackbarContainer.MaterialSnackbar.showSnackbar(msgSnackbar);
		}
		


	}]);