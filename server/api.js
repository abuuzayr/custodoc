var routes = require('express').Router();
//import modules
var auth = require('./utils/403.js')();
var http403 = require('./utils/404.js')();
var http404 = require('./utils/404.js')();
//add routes
var protectedRoutes = require('./routes/protected');
//AUTH
//routes.use('/',auth.authenticateToken);
routes.use('/protected', protectedRoutes)
//UNDEFINED ROUTES
routes.use('*', http404.notFoundMiddleware);

//export module
module.exports = routes;
