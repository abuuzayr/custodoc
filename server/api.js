var routes = require('express').Router();
//import modules
var auth = require('./utils/403.js')();
var http404 = require('./utils/404.js')();
//add routes
routes.use('/',auth.authenticateToken);
routes.use('/',auth.verifyAccess);
routes.use('/autofill', require('./modules/autofill.js'));
//routes.use('/entrymgmt', entrymgmt)

//UNDEFINED ROUTES
routes.use('*', http404.notFoundMiddleware);

//export module
module.exports = routes;
