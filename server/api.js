var routes = require('express').Router();
//import modules
var auth = require('./utils/403.js')();
var http404 = require('./utils/404.js')();
//add routes
var autofillRoutes = require('./modules/autofill');
var entryrecordsRoutes = require('./modules/entryRecords');

//AUTH
//routes.use('/',auth.authenticateToken);

routes.use('/autofill', autofillRoutes);
routes.use('/entryrecords', entryrecordsRoutes);

//UNDEFINED ROUTES
routes.use('*', http404.notFoundMiddleware);

//export module
module.exports = routes;
