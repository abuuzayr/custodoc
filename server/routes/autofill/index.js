const autofill = require('express').Router();
//import modules
const QueryKeywords = require('./QueryKeywords');
const QueryAll = require('./QueryAll');
//add routes
autofill.use('/query/:query',QueryKeywords);
autofill.use('/query',QueryAll);
// autofill.route('/query/:query',QueryKeywords);
// autofill.route('/query')
		
// 		.get(QueryAll)
		
// 		.post(function (res,req,next){

// 		});
//export module
module.exports = autofill;




