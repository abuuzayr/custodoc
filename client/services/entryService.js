angular.module('entryService', [])

.factory('entryService', function($http) {

	var entryFactory = {};
	
	/************************************** LEGEND *************************************/

	/* entData = Data that includes groupName OR user input. NOT AN ENTRY */
	/* entryData = Variable entryData that is used to insert into database as an entry */	

	/***********************************************************************************/
	
	/* FUNCTIONS THAT DO BASIC CRUD */

	// get all entries
	entryFactory.getAllEntries = function() {
		return $http.get('localhost:3001/protected/entry');
	};

	// create an entry
	entryFactory.create = function(finalData) {
		return $http.post('localhost:3001/protected/entry', finalData);
	};

	// delete an entry, entData contains groupName
	entryFactory.delete = function(entData) {
		return $http.delete('/entryRouter/entries', entData);
	};

	/* OTHER FUNCTIONS */
	
	// retrieves all the keys aka field names from all the forms in that particular group, entData contains groupName
	entryFactory.retrieveKeys = function(entData) {
		return $http.post('/entryRouter/functions', entData);
	};

	// retrieves all user input for the respective keys, entData contains groupName AND user input
	entryFactory.retrieveInput = function(entData) {
		return $http.get('/entryRouter/functions', entData);
	};

	return entryFactory;

});
