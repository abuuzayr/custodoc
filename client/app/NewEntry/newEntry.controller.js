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
	vm.entryData = [];  

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
					for (var i = 0; i < vm.formData.length ; i++){
				 	   var data = vm.formData[i];
				  	  	var elements = data.elements;
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
					        object.data = vm.image;

					        arrayOfKeys.push(object);

						} else if (element.name.startsWith('signature_')) {
							// vm.gotSignature = true;
							var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
							object.type = 'signature';
					        object.name = fieldName;
					        object.label = fieldName;
					        object.data = vm.signature;

					        arrayOfKeys.push(object);
					    }
				    }
				}
				vm.parsedFormData = arrayOfKeys;
		})
		.then(function() {

		    vm.entryData = [{
				groupName    : vm.groupName,
				creationDate : Date(),
				lastModified : Date()
		    }];
	
		    vm.entryData.push.apply(vm.entryData, vm.parsedFormData);
	 
		    console.log("Next log: " + JSON.stringify(vm.entryData));	     	
		})
		.then(function(){
			for(var k=1; k<=vm.formData.length; k++){ //k is the form number
				var form = vm.formData[k-1];
				var elements = form.elements;

				for (var j = 1; j <= form.numberOfPages; j++) { //j is page number
					var newPage = newPageTemplate.cloneNode(true);
					newPage.setAttribute("id", 'form' + k + 'page' + j);
					newPage.style.display = "none";
					body.appendChild(newPage);
				}
				for (key in elements){
					var element = elements[key];
					if(element.name.startsWith('background_')){
						var node = document.createElement('img');
						node.src = element.src;	
						node.style.zIndex="0";
					}else if(element.name.startsWith('label_')){
						var node = document.createElement('div');
						node.innerHTML = element.content;
						node.style.whiteSpace="pre-wrap";
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
					}else if(element.name.startsWith('auto_text') || element.name.startsWith('text_')){
						var node = document.createElement('input');
						node.type='text';
						node.placeholder=element.default;
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
						//node.value = vm.text;
					}else if(element.name.startsWith('auto_checkbox') || element.name.startsWith('checkbox_')){
						var node = document.createElement('label');
						var span = document.createElement('span');
						var checkbox = document.createElement('input');
						checkbox.type="checkbox";
						checkbox.checked = element.default;
						span.innerHTML = element.label;
						node.appendChild(checkbox);
						node.appendChild(span);
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
					}else if(element.name.startsWith('auto_dropdown') || element.name.startsWith('dropdown_')){
						var node = document.createElement('select');
						var options = element.options;
						if(options.length>0){
							for(var i = 0; i<options.length; i++){
								var option = document.createElement('option');
								option.innerHTML=options[i];
								node.appendChild(option);
							}
						}
						node.value = element.default;
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
					}else if(element.name.startsWith('auto_radio') || element.name.startsWith('radio')){
						var node = document.createElement('form');
						var options = element.options;
						if(options.length>0){
							if (element.display==="radioInline") var display = "inline";
							else var display = "block";
							for(var i=0; i<options.length; i++){
								var label = document.createElement("label");
								var option = document.createElement("input");
								option.type = "radio";
								option.name = element.name;
								option.value = options[i];
								if(options[i]===element.default) option.checked = true;
								var span = document.createElement("span");
								span.innerHTML=options[i]+" ";
								label.appendChild(option);
								label.appendChild(span);
								label.style.display=display;
								node.appendChild(label);
							}
							node.className +=" "+ element.display;
						}
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
					}else if(element.name.startsWith('signature_')){
						var node = document.createElement('canvas');
						node.style.backgroundColor = element.backgroundColor;
						node.style.zIndex="1";
						// vm.gotSignature = true;
					}else if (element.name.startsWith('image_')) {
						var node = document.createElement('canvas');
						node.style.backgroundColor = element.backgroundColor;
						node.style.zIndex="1";
					}
					node.style.opacity = element.opacity;
					node.style.border = element.border;
					node.style.borderRadius = element.borderRadius;
					node.className +=" notSelectable";
					node.id = key;
					node.setAttribute('name',element.name);
					node.style.overflow = "hidden";
					node.style.lineHeight="100%";
					node.style.position="absolute";
					node.style.overflow = "hidden";
					node.style.width = element.width+'px';
					node.style.height = element.height+'px';
					node.style.top = element.top+'px';
					node.style.left = element.left+'px';
					node.style.position = "absolute";
					var page = document.getElementById('form'+k+'page'+element.page);
					page.appendChild(node);

				}
			}
			
			document.getElementById("form1page1").style.display="block"; 
		})

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
		console.log(JSON.stringify(vm.entryData));
	    entryService.create(vm.entryData)  
	        .success(function(data) {
		    // clear the form
		    vm.formData = {};
		    vm.message = data.message;
		    location.reload()
	    });
	};

}]);
