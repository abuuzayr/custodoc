'use strict';
// Import packages 
var express = require('express');
var bodyParser = require('body-parser');
//var helmet = require('helmet')
var CookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var database;
//  Import custom modules
var config = require('./config');
var routes = require('./api');
var http404 = require('./utils/404')();

// Configuration
//app.use(helmet());
app.use(bodyParser.json());
app.use(CookieParser());
app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token');
  next();
});

// Connect all our routes to our application
app.use('/api', routes);
app.use('/static', express.static('../client/autofill'));
app.use('*',http404.notFoundMiddleware);

// Open one database connection
// one connection handles all request
MongoClient.connect(config.dbURL,function(err,db){
	
	if(err) throw err;
	database = db;

	// Start Server after database connection is ready
	app.listen(config.port,function(){
		console.log('Express server listening on port '+ config.port);
		console.log('env = ' + app.get('env') + 
			'\n__dirname = ' + __dirname + 
			'\nprocess.cwd = ' + process.cwd());
	});

	module.exports = {db: database};
});




