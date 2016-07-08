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



	// this formData stores the current selected forms that are going to be used to create an entry
	vm.formData = [];

	// this parsedFormData stores objects that contain the type, name, label, data of the all the elements taken from formData
	vm.parsedFormData = [];

	/* this entryData stores the final data structure for an entry, which contains the groupName  
		and the relevant fields obtained from the form database	*/
	vm.entryData = [];  
	
	vm.file = null;

	vm.groupName = $stateParams.groupName;

	/********* PAGE NAGIVATION VARIABLES **********/
	vm.goToPageNumber = 1;
	vm.currentPageNumber = 1;
	vm.numberOfPages = 1;
	vm.totalNumberOfPages = [];
	vm.currentFormNumber = 1;
	vm.numberOfForms = 1;

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

	/*****   FOR CHECKBOX   *
	
	vm.selected = [];
	
	console.log(JSON.stringify(vm.selected));

	vm.toggleSelection = function (option) {
	    var idx = vm.selected.indexOf(option);
	
	    if (idx > -1) {
		vm.selected.splice(idx, 1);
	    } else { 
		vm.selected.push(option);	
	    }
	};
	
	****************************/

	/*// initialize the data to contain all entries and lets the htmlview retrieve this data
	vm.getEntries = function() {
	    entryService.getAllEntries()
		.then(function(res) {
                        vm.entry = res.data;
		//	console.log(JSON.stringify(res));
                })
                .catch(function(err) {
                    console.log("Error " + JSON.stringify(err));
                });
	};
	
	vm.getEntries();*/

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
			// number of forms??
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
					//console.log("What is the name: " + element.name);
					if(element.name.startsWith('background_')){
						var node = document.createElement('img');
						node.src = element.src;	
						node.style.zIndex="0";
					}else if(element.name.startsWith('label_')){
						//console.log("Did i come here then? label");
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
						//console.log("Did i come here then? text");
						var node = document.createElement('input');
						node.type='text';
						node.placeholder=element.default;
						//node.data = '';
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
					}else if(element.name.startsWith('auto_checkbox') || element.name.startsWith('checkbox_')){
						//console.log("Did i come here then? checkbox");
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
						//console.log("Did i come here then? dropdown");
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
						//console.log("Did i come here then? radio");
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
					/*console.log("Page?: " + k);
					console.log("Wats my node: " + node);*/
					page.appendChild(node);

				}
			}
			
			document.getElementById("form1page1").style.display="block"; 
		})

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
		if (vm.currentPageNumber >= vm.totalNumberOfPages) {
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
			currentPage = document.getElementById("form" + vm.currentFormNumber + "page1");
			currentPage.style.display = "block";
		}
	}

	/*function addImg() {
		if(!vm.file){
			alert('Please upload an image');
		}else if (vm.file && vm.file.filesize>2000000) {
			alert('Maximum size allowed is 2Mb');
		}else{
			var img = document.createElement("img");
			var i = 0;
			while (elements.hasOwnProperty("background_" + i)) {
				i++;
			}
			img.setAttribute("id", "background_" + i);
			img.setAttribute("name", "background_" + i);
			elements["background_" + i] = {};
			vm.imageString = 'data:image/png;base64,' + vm.file.base64;
			img.setAttribute("src", vm.imageString);
			setNewElement(img);
			img.style.zIndex = "0";
			vm.file = null;
		}		
	}*/

//	console.log(vm.formData);

	/**** UNDER CONSTRUCTION  ****
	
	// function to delete ntry
	vm.deleteEntry = function() {
	    entryService.delete(vm.entData)
		.success(function(data) {
		
		    // after deleting, get the new list of entries and return it for display
		    entryService.getAllEntries()
			.success(function(data) { 
			    vm.entries = data;
			});
		});
	};    
	
	// call this function first before creating an entry
	/*vm.retrieveKeys = function() {
	    var keys = ["Name", "Country", "State", "Address", "Gender"];
	    entry.retrieveKeys(vm.entData)
		.success(function(keys) {
		    return keys;
		}); 
	    return keys;
	};*/

	// Function to create an entry
	vm.createEntry = function() {
	    entryService.create(vm.entryData)  
	        .success(function(data) {
		    // clear the form
		    vm.formData = {};
		    vm.message = data.message;
		    location.reload()
	    });
	};

}]);
