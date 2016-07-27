var protectedRoutes = require('express').Router();
//import modules
var auth = require('../utils/403.js')();
var http404 = require('../utils/404.js')();
var http403 = require('../utils/403.js')();
//add routes
var autofillRoutes = require('./protected/autofill.js');
var entryRoutes = require('./protected/entryRouter.js');
var formRoutes = require('./protected/formsRouter.js');
var groupRoutes = require('./protected/groupsRouter.js');


//PROTECTED ROUTES - REQUIRES TOKEN_AUTH & ACL CHECKINGS
// protectedRoutes.use('*',http403.decodeSessionCookie);
// protectedRoutes.use('*',http403.signIdCookie);
// protectedRoutes.use('*',http403.decodeAccessInfo);
//PATH
protectedRoutes.use('/autofill', autofillRoutes);
protectedRoutes.use('/entries',entryRoutes);
protectedRoutes.use('/forms',formRoutes);
protectedRoutes.use('/groups',groupRoutes);

//UNDEFINED ROUTES
protectedRoutes.use('*', http404.notFound);

//export module
module.exports = protectedRoutes;
