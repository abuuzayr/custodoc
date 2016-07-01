angular
    .module('user-interface')
    .controller("newEntryCtrl", ['$stateParams', 'entryService', '$scope', '$q', '$location', '$timeout', function ($stateParams, entryService, $scope, $q, $location, $timeout) {
        var viewContentLoaded = $q.defer();
        
	var vm = this;

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

	/* This function gets the formData from the form database, then parse the formData to form key/value pair in parsedFormData
		and finally create a proper entry data structure */

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
