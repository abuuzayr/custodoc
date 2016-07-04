var protectedRoutes = require('express').Router();
//import modules
var auth = require('../utils/403.js')();
var http404 = require('../utils/404.js')();
var http403 = require('../utils/403.js')();
//add routes
var autofillRoutes = require('./protected/autofill.js');
var entryrecordsRoutes = require('./protected/entryRecords.js');
var entryRoutes = require('./protected/entryRouter.js')
var formRoutes = require('./protected/formsRouter.js');
var groupRoutes = require('./protected/groupsRouter.js');
var usermgmtRoutes  = require('./protected/usermgmt.js');


//PROTECTED ROUTES - REQUIRES TOKEN_AUTH & ACL CHECKINGS
protectedRoutes.use('*',http403.authenticateToken);
//protectedRoutes.use('*',http403.decodeAccessInfo);
//PATH
protectedRoutes.use('/autofill', autofillRoutes);
protectedRoutes.use('/entryrecords', entryrecordsRoutes);
protectedRoutes.use('/entries',entryRoutes);
protectedRoutes.use('/forms',formRoutes);
protectedRoutes.use('/groups',groupRoutes);
protectedRoutes.use('/users',usermgmtRoutes);

//UNDEFINED ROUTES
protectedRoutes.use('*', http404.notFoundMiddleware);

//export module
module.exports = protectedRoutes;