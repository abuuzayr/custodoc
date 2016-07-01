angular.module('entryService', [])

.factory('entryService', function($http) {
	var serverURL = "http://10.4.1.201:3001/api/protected";
	var entryFactory = {
		getAllEntries: getAllEntries,
		create: create,
		deleteEntry: deleteEntry,
		retrieveKeys: retrieveKeys,
		retrieveInput: retrieveInput,
		getFormElements: getFormElements
	};
	
	
	/************************************** LEGEND *************************************/

	/* entData = Data that includes groupName OR user input. NOT AN ENTRY */
	/* entryData = Variable entryData that is used to insert into database as an entry */	

	/***********************************************************************************/
	
	/* FUNCTIONS THAT DO BASIC CRUD */

	// get all entries
	function getAllEntries() {
		return $http.get(serverURL+'/entries');
	};

	// create an entry
	function create(finalData) {
		return $http.post(serverURL+'/entries', finalData);
	};

	// delete an entry, entData contains groupName
	function deleteEntry(entData) {
		return $http.delete(serverURL+'/entryRouter/entries', entData);
	};

	/* OTHER FUNCTIONS */
	
	// retrieves all the keys aka field names from all the forms in that particular group, entData contains groupName
	function retrieveKeys(entData) {
		return $http.post(serverURL+'/entries/functions'+groupName);
	};

	// retrieves all user input for the respective keys, entData contains groupName AND user input
	function retrieveInput(entData) {
		return $http.get(serverURL+'/entryRouter/functions', entData);
	};

	// get the group name, return an array of objects, each objects contain the information of a form in the group
	// properties of the object: formName, groupName, numberOfPage, elements, isImportant, creationDate...
	function getFormElements(groupName){
		return $http.get(serverURL+'/groups/getGroupForms/'+groupName);
	}

	return entryFactory;

});
