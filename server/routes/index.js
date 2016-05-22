var routes = require('express').Router();

//import modules
const autofill = require('./autofill');
//add routes
routes.use('/autofill', autofill);
//export module
module.exports = routes;
