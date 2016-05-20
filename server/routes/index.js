var routes = require('express').Router();
const autofill = require('./autofill');
//
routes.get('/autofill', autofill);
//
module.exports = routes;
