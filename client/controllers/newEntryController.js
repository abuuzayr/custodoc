angular
    .module("user-interface", ['entryService'])
    .controller("newEntryCtrl", ['entryService', '$scope', '$q', '$location', '$timeout', function (entryService, $scope, $q, $location, $timeout) {
        var viewContentLoaded = $q.defer();
        
	var vm = this;
	vm.entryData = [];
	vm.file = null;

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

	vm.entryData = {
	    fields : 
	    [
		{type: "text", name: "Name", label: "Name", data:"SugarContent"},
		{type: "text", name: "Country", label: "Country", data:"Singapore"},
		{type: "text", name: "State", label: "State", data:"Tampines"},
		{type: "text", name: "Address", label: "Address", data:"Blk 138"},
		{type: "text", name: "Gender", label: "Gender", data:"Male"},
		{type: "image", name: "Picture", label: "Picture", data:""}
	    ]
	
	}
	
	console.log("Hey hey" + JSON.stringify(vm.file));	     	

	/**** UNDER CONSTRUCTION  ****
	
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
	};    */
	
	// call this function first before creating an entry
	vm.retrieveKeys = function() {
	    var keys = ["Name", "Country", "State", "Address", "Gender"];
	    /*entry.retrieveKeys(vm.entData)
		.success(function(keys) {
		    return keys;
		}); */
	    return keys;
	};
	
	vm.myKeys = vm.retrieveKeys();

	vm.createEntry = function() {
	    //var name = vm.entData.groupName;
	

	    //TODO: INCLUDE USER INPUT VALUES INSIDE ENTRYDATA
	    var entryData2 = [{
		groupName    : 'test',
		creationDate : Date(),
		lastModified : Date()
	    }];
	   
	    // finalData is the object that contains vm.entryData and entryData2 
	    var finalData = {};
	    for (var x in vm.entryData) { finalData[x] = vm.entryData[x]; }
	    for (var x in entryData2) { finalData[x] = entryData2[x]; }	   
 
	   console.log("Next log: " + JSON.stringify(finalData));	     	

	   entryService.create(finalData)  
	        .success(function(data) {
		    // clear the form
		    vm.entryData = {};
		    vm.message = data.message;
		    location.reload()
	    });
	};

    }]);
