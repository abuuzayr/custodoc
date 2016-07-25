(function(){
    "use strict";

// Import packages 
var express = require('express');
var bodyParser = require('body-parser');
var CookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var assert = require('assert'); //TOFIX?
var path = require('path'); //TOFIX?
var logger = require('morgan'); //TOFIX?
var app = express();

Promise.promisifyAll(MongoClient);
//  Import custom modules
var config = require('./config');
var routes = require('./api');
var http404 = require('./utils/404')();
// Configuration
app.use(logger('dev'));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(bodyParser.json());
app.use(CookieParser());
app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token');
  if(req.method === 'OPTIONS')
    return res.status(200).send('Preflight get response');
  else
  	return next();
});

// ROUTES
// Connect all our routes to our application
app.use('/api', routes);
app.use('*',http404.notFoundMiddleware);
// STARTING SERVER
// Open one database connection
// one connection handles all request
MongoClient.connectAsync(config.dbURL)
	.then(function (db){
		module.exports = {db: db};

		app.listen(config.port,function(){
			console.log('Express server listening on port '+ config.port);
		});
	})
	.catch(function(err){
		console.log(err);
	});

})();