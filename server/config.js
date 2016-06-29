module.exports = {
	port : process.env.PORT || 3001,
	environment : process.env.NODE_ENV,
	dbURL :'mongodb://localhost:27017/test',
	//dbIRL:'mongodb://localhost:27017/custodoc',
	secret : 'gilbert_what_time_is_it_now',
	ObjectId : require('mongodb').ObjectID
}

// 	Router Structure:  api (server/api.js) ---------->	protected (server/routes/protected.js)-----------> all the modules below 			
//  
//	- protected routes requires token autentication and access level control	
//	
//	- unprotected routes includes routes for activities like login, forget password etc...
//
//
// API_ENDPOINTS autofill		'http://localhost:3001/api/protected/autofill'
// API_ENDPOINTS entryrecords	'http://localhost:3001/api/protected/entryrecords'
// API_ENDPOINTS entry			'http://localhost:3001/api/protected/entry'
// API_ENDPOINTS forms			'http://localhost:3001/api/protected/forms'
// API_ENDPOINTS groups			'http://localhost:3001/api/protected/groups'