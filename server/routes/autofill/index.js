const autofill = require('express').Router();
//import modules
const Auth = require('../../utils/403.js')();
const query = require('./query')();
//add routes
console.log("entered autofill");
autofill.use(function(req,res,next){ Auth.authenticateToken(req,res,next)});
autofill.use('/query/:query',query.QueryKeywords);
autofill.use('/query',query.QueryAll);
autofill.use('/*', function(req,res){ http404.notFoundMiddleware(req,res); });

	// autofill.route('/query/:query',QueryKeywords);
	// autofill.route('/query')			
	// 		.get(QueryAll)			
	// 		.post(function (res,req,next){/*...*/});

//export module
module.exports = autofill;




