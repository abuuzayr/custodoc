//connection.js //Handles database connection 
module.exports = function(){
	return {Do: Do};
	function Do(dbOperation){
		var db = require('../server.js').db
		console.log("db: " + db);
    	dbOperation(db);    	
	}
}