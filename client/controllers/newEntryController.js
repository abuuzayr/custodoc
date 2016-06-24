angular
    .module("user-interface", ['entryService'])
    .controller("newEntryCtrl", ['entryService', '$scope', '$q', '$location', '$timeout', function (entryService, $scope, $q, $location, $timeout) {
        var viewContentLoaded = $q.defer();
        
	var vm = this;
	vm.entryData = {};

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
	
	// initialize the data to contain all entries and lets the htmlview retrieve this data
	vm.getEntries = function() {
	    entryService.getAllEntries()
		.then(function(res) {
                        vm.entry = res.data;
			console.log(JSON.stringify(res));
                })
                .catch(function(err) {
                    console.log("Error " + JSON.stringify(err));
                });
	};
	
	vm.getEntries();
	vm.entryData = vm.getEntries();
	
	// function to delete an entry
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
	vm.retrieveKeys = function() {
	    var keys = ["Name", "Country", "State", "Address", "Gender"];
	    /*entry.retrieveKeys(vm.entData)
		.success(function(keys) {
		    return keys;
		}); */
	    return keys;
	};

	vm.createEntry = function() {
	    //var name = vm.entData.groupName;
	
	    //TODO: INCLUDE USER INPUT VALUES INSIDE ENTRYDATA
	    var entryData2 = {
		groupName    : 'test',
		creationDate : Date(),
		lastModified : Date()
	    };
	    
           vm.entryData.merge(entryData2); 

	   // var keys = retrieveKeys();
		
	    // call this function after retrieving keys to get user input values to bind the keys with	
	//    var retrieveInput = function() {
	 //       entry.retrieveInput(vm.entData)
	//	.success(function(input) {
//		    return input;
//		});
//	    };   
	
//	    var input = retrieveInput(); 

//	    for(var i=0; i<keys.length; i++) {
//		entryData[keys[i]] = input[i];    
//	    }

	    entryService.create(entryData)  
	        .success(function(data) {
		    // clear the form
		    vm.entData = {};
		    vm.message = data.message;
	    });
	};

    }]);
