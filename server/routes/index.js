var routes = require('express').Router();
const autofill = require('./autofill/index.js');
//
routes.use('/autofill', autofill);
//
module.exports = routes;
