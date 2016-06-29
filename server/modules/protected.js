var protectedRoutes = require('express').Router();
//import modules
var auth = require('../utils/403.js')();
var http404 = require('../utils/404.js')();
//add routes
var autofillRoutes = require('./protected/autofill.js');
var entryrecordsRoutes = require('./protected/entryRecords.js');

protectedRoutes.use('/autofill', autofillRoutes);
protectedRoutes.use('/entryrecords', entryrecordsRoutes);

//UNDEFINED ROUTES
protectedRoutes.use('*', http404.notFoundMiddleware);

//export module
module.exports = protectedRoutes;