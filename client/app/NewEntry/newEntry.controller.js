angular
    .module('app.core')
    .controller("newEntryCtrl", ['$stateParams', 'entryService', 'formsFactory' '$scope', '$q', '$location', '$timeout', function ($stateParams, entryService, formsFactory, $scope, $q, $location, $timeout) {
        var viewContentLoaded = $q.defer();
        
	var vm = this;
	var forms = document.getElementById('forms');

	// this formData stores the current selected forms that are going to be used to create an entry
	vm.formData = [];

	// this parsedFormData stores objects that contain the type, name, label, data of the all the elements taken from formData
	vm.parsedFormData = [];

	/* this entryData stores the final data structure for an entry, which contains the groupName  
		and the relevant fields obtained from the form database	*/
	vm.entryData = [];  
	

	vm.groupName = $stateParams.groupName;

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

	/* This function gets the formData from the form database, then parse the formData to form key/value pair in parsedFormData, then
	create a proper entry data structure, then finally print out the preview of all the forms in the group*/

	vm.getFormData = entryService.getFormElements(vm.groupName)
		.then(function(res){
			vm.formData = res.data;
		})
		.then(function() {
				var arrayOfKeys = [];
					var key;
					for (var i = 0; i < vm.formData.length ; i++){
				 	   var data = vm.formData[i];
				  	  	var elements = data.elements;
				   	 for (key in elements) {
						var element = elements[key];
						console.log("how many times");
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
		    
		    // finalData is the object that contains fields and entryData2 
		    vm.entryData.push.apply(vm.entryData, vm.parsedFormData);
	 
		    console.log("Next log: " + JSON.stringify(vm.entryData));	     	

		})
		.then(function(){
			console.log(vm.formData.length);
			for(var n = 0; n < vm.formData.length; n++) {
				vm.numberOfPages = vm.formData.numberOfPages;
				var elements = vm.formData.elements;
				for (var j = 1; j <= vm.numberOfPages; j++) {
					var newPage = formsFactory.newPage.cloneNode(true);
					newPage.setAttribute("id", 'form' + formNumber + "page" + j);
					newPage.style.display = "none";
					forms.appendChild(newPage);
				}
				for (key in elements) {
					var element = elements[key];
					if (element.name.startsWith('background_')) {
						var node = document.createElement('img');
						node.src = element.src;
						node.style.zIndex = "0";
					} else if (element.name.startsWith('label_')) {
						var node = document.createElement('div');
						node.innerHTML = element.content;
						node.style.whiteSpace = "pre-wrap";
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('text_') || element.name.startsWith('auto_text_')) {
						var node = document.createElement('input');
						node.type = 'text';
						node.placeholder = element.default;
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('auto_dropdown') || element.name.startsWith('dropdown_')) {
						var node = document.createElement('select');
						var options = element.options;
						for (var i = 0; i < options.length; i++) {
							var option = document.createElement('option');
							option.innerHTML = options[i];
							if (options[i]===element.default) option.setAttribute("selected",true);
							node.appendChild(option);
						}
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					}else if(element.name.startsWith('auto_radio') || element.name.startsWith('radio')){
						var node = document.createElement('form');
						var options = element.options;
						if (element.display==="radioInline") var display = "inline";
						else var display = "block";
						if(options.length>0){
							for(var i=0; i<options.length; i++){
								var label = document.createElement("label");
								var option = document.createElement("input");
								option.type = "radio";
								option.name = element.name;
								option.value = options[i];
								if(options[i]===element.default) option.setAttribute("checked",true);
								var span = document.createElement("span");
								span.innerHTML=options[i]+" ";
								label.style.display = display;
								label.appendChild(option);
								label.appendChild(span);
								node.appendChild(label);
							}
						}
						node.className = element.display;
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex="1";
					} else if (element.name.startsWith('signature_')) {
						var node = document.createElement('canvas');
						node.style.backgroundColor = element.backgroundColor;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('image_')) {
						var node = document.createElement('canvas');
						node.style.backgroundColor = element.backgroundColor;
						node.style.zIndex = "1";
					} else if (element.name.startsWith('auto_checkbox') || element.name.startsWith('checkbox_')) {
						var node = document.createElement('label');
						var span = document.createElement('span');
						var checkbox = document.createElement('input');
						checkbox.type = "checkbox";
						if(element.default) checkbox.setAttribute("checked",true);
						checkbox.setAttribute("ng-checked",element.default);
						$compile(checkbox)($scope);
						span.innerHTML = element.label;
						node.appendChild(checkbox);
						node.appendChild(span);
						node.style.color = element.color;
						node.style.backgroundColor = element.backgroundColor;
						node.style.fontFamily = element.fontFamily;
						node.style.fontSize = element.fontSize;
						node.style.textDecoration = element.textDecoration;
						node.style.zIndex = "1";
					}
					node.style.opacity = element.opacity;
					node.style.border = element.border;
					node.style.borderRadius = element.borderRadius;
					node.style.overflow = "hidden";
					node.style.lineHeight = "100%";
					node.style.position = "absolute";
					node.style.overflow = "hidden";
					node.style.width = element.width + 'px';
					node.style.height = element.height + 'px';
					node.style.top = element.top + 'px';
					node.style.left = element.left + 'px';
					node.style.position = "absolute";
					var page = document.getElementById('form' + formNumber + 'page' + element.page);
					page.appendChild(node);

				}
				// formNumber NOT USED
				deferred.resolve(formNumber);
			}

		})		

//	console.log(vm.formData);

	/**** UNDER CONSTRUCTION  ***f
	
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
	};    */
	
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
