angular
    .module('app.newEntry')
    .controller("newEntryCtrl", [
    	'$stateParams', 
    	'entryService', 
    	'formsFactory',
    	'formBuilderFactory', 
    	'$scope', 
    	'$q', 
    	'$location', 
    	'$timeout', 

    function (
    	$stateParams, 
    	entryService, 
    	formsFactory, 
    	formBuilderFactory,
    	$scope, 
    	$q, 
    	$location, 
    	$timeout
    	) {

    var viewContentLoaded = $q.defer();
        
	var vm = this;
	var forms = document.getElementById('forms');
	var newPageTemplate = formBuilderFactory.newPage;

	// variables that contain base-64 encoding converted from user input
	vm.image = null;
	vm.signature = null;
	
	vm.gotSignature = false;

	vm.groupName = $stateParams.groupName;
	

	/*********** ARRAY VARIABLES THAT STORE FORM/ENTRY DATA **********/

	// this formData stores the current selected forms that are going to be used to create an entry
	vm.formData = [];

	// this parsedFormData stores objects that contain the type, name, label, data of the all the elements taken from formData
	vm.parsedFormData = [];

	/* this entryData stores the final data structure for an entry, which contains the groupName  
		and the relevant fields obtained from the form database	*/
	vm.entryData = {};
	
	vm.finalData = {};

	/*****************************************************************/
	

	/****************** PAGE NAGIVATION VARIABLES ********************/

	vm.goToPageNumber = 1;
	vm.currentPageNumber = 1;
	vm.numberOfPages = 1;
	vm.totalNumberOfPages = [];
	vm.currentFormNumber = 1;
	vm.numberOfForms = 1;

	/*****************************************************************/

    $scope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            viewContentLoaded.resolve();
        }, 0);
    });
    viewContentLoaded.promise.then(function () {
        $timeout(function () {
            componentHandler.upgradeDom();
			vm.wrapper = angular.element(document.getElementById('signature-field-div'));
			vm.dialog = angular.element(vm.wrapper.find('dialog'))[0];
			vm.canvas = angular.element(vm.wrapper.find('canvas'))[0];
			vm.signaturePad = new SignaturePad(vm.canvas);
        }, 0);
    });

	/* This long, core function gets the formData from the form database, then parse the formData to form key/value pair in parsedFormData, then
	create a proper entry data structure, then finally print out the preview of all the forms in the group*/

	vm.getFormData = entryService.getFormElements(vm.groupName)
		.then(function(res){
			vm.formData = res.data;
			for(var x = 0; x < vm.formData.length; x++) {
				vm.totalNumberOfPages[x] = vm.formData[x].numberOfPages;
			}
			vm.numberOfForms = vm.totalNumberOfPages.length;
			vm.numberOfPages = vm.totalNumberOfPages[0];
		})
		.then(function() {
				var arrayOfKeys = [];
					var key;
					vm.entryData = [{
						groupName    : vm.groupName,
						creationDate : Date(),
						lastModified : Date(),
						data: {}
				    }];
					for (var i = 0; i < vm.formData.length ; i++){
				 	   var data = vm.formData[i];
				  	  	var elements = data.elements;
				  	  	vm.entryData.formName = vm.formData[i].formName;
				   	 for (key in elements) {
						var element = elements[key];
						//console.log("how many times");
						var object = {};
						if (element.name.startsWith('text_')) {
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }

						    if (noDuplicate) {
						    	object.type = 'text';
						        object.name = fieldName;
						        object.label = fieldName;
						        object.data = def;

						    }

						    arrayOfKeys.push(object);

						} else if (element.name.startsWith('dropdown_')) {
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var options = element.options;
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }

						    if (noDuplicate) {
						    	object.type = 'dropdown';
						        object.name = fieldName;
						        object.label = fieldName;
						        object.options = options;
						        object.data = def;

						    }

						    arrayOfKeys.push(object);

						}  else if (element.name.startsWith('checkbox_')) {
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }

						    if (noDuplicate) {
						    	object.type = 'checkbox';
						        object.name = fieldName;
						        object.label = fieldName;
						        object.data = def;

						    }

						    arrayOfKeys.push(object);

						} else if (element.name.startsWith('radio_')) {
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var options = element.options;
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }

						    if (noDuplicate) {
						    	object.type = 'radio';
						        object.name = fieldName;
						        object.label = fieldName;
						        object.options = options;
						        object.data = def;
			        
						    }

						    arrayOfKeys.push(object);

						} else if (element.name.startsWith('image_')) {
							var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
							object.type = 'image';
					        object.name = fieldName;
					        object.label = fieldName;
					        object.data = '';

					        arrayOfKeys.push(object);

						} else if (element.name.startsWith('signature_')) {
							// vm.gotSignature = true;
							var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
							object.type = 'signature';
					        object.name = fieldName;
					        object.label = fieldName;
					        object.data = '';

					        arrayOfKeys.push(object);
					    }
				    }
				}
				vm.parsedFormData = arrayOfKeys;
		});

	/******************* PAGE & FORM NAVIGATION FUNCTIONS ********************/

	vm.toPreviousPage = function() {
		//toolbar.style.display = "none";
		if (vm.currentPageNumber == 1) {
			alert("This is the first page.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentPageNumber--;
			currentPage = document.getElementById("form" + vm.currentFormNumber+ "page" + vm.currentPageNumber);
			currentPage.style.display = "block";
		}
	}

	vm.toNextPage = function() {
		//toolbar.style.display = "none";
		if (vm.currentPageNumber == vm.numberOfPages) {
			alert("This is the last page.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentPageNumber++;
			currentPage = document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber);
			currentPage.style.display = "block";
		}
	}

	vm.goToPage = function() {
		//toolbar.style.display = "none";
		currentPage.style.display = "none";
		vm.currentPageNumber = vm.goToPageNumber;
		currentPage = document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber);
		currentPage.style.display = "block";
	}

	vm.toPreviousForm = function() {
		if (vm.currentFormNumber == 1) {
			alert("This is the first form.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentFormNumber--;
			vm.numberOfPages = vm.totalNumberOfPages[vm.currentFormNumber-1];
			vm.currentPageNumber = 1;
			currentPage = document.getElementById("form" + vm.currentFormNumber+ "page1");
			currentPage.style.display = "block";	
		}
	}

	vm.toNextForm = function() {
		if (vm.currentFormNumber == vm.numberOfForms) {
			alert("This is the last form.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentFormNumber++;
			vm.numberOfPages = vm.totalNumberOfPages[vm.currentFormNumber-1];
			vm.currentPageNumber = 1;
			currentPage = document.getElementById("form" + vm.currentFormNumber + "page1");
			currentPage.style.display = "block";
		}
	}

	/*************************************************************************/

	/*********************** SIGNATURE PAD FUNCTIONS *************************/

	vm.openModal = function() {
		vm.dialog.showModal();	
	}
	
	vm.closeModal = function() {
		vm.dialog.close();	
	}

	vm.clear = function() {
		vm.signaturePad.clear();
	};

	vm.save = function() {
		if (vm.signaturePad.isEmpty()) {
    		var msg = "Please provide signature first.";
    		showSnackbar(msg);
		 } else {
		 	var dataURL = vm.signaturePad.toDataURL('image/png',1);
			var data = dataURL.substr(dataURL.indexOf('base64') + 7)
			return data;
		}
	}

	function showSnackbar(msg) {
		var msgSnackbar = {
			message: msg,
			timeout: 5000
		}
		var snackbarContainer = document.querySelector('#snackbar-div');
		console.log(snackbarContainer);
		snackbarContainer.MaterialSnackbar.showSnackbar(msgSnackbar);
	}

	/*************************************************************************/

	// Function to create an entry
	vm.createEntry = function() {
    	vm.finalData = {
			groupName    : vm.groupName,
			creationDate : Date(),
			lastModified : Date(),
			data         : vm.entryData
    	};
	    entryService.create(vm.finalData)  
	        .success(function(data) {
		    // clear the form
		    vm.formData = {};
		    vm.message = data.message;
		    location.reload()
	    });
	};

}]);
