const autofill = require('express').Router();
//import modules
const Auth = require('../utils/403.js')();
const query = require('./query')();
//add routes
autofill.use(function(req,res,next){ Auth.authenticateToken(req,res,next)});
autofill.use('/query/:query',query.QueryKeywords);
autofill.use('/query',query.QueryAll);
autofill.use('/*', function(req,res){ http404.notFoundMiddleware(req,res); });
//export module
module.exports = autofill;




