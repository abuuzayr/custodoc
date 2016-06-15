'use strict';
// Import packages 
var express = require('express');
var bodyParser = require('body-parser');
var CookieParser = require('cookie-parser');
var Promise = require('bluebird')
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var app = express();
//  Import custom modules
var config = require('./config');
var routes = require('./api');
var http404 = require('./utils/404')();
// Configuration
app.use(bodyParser.json());
app.use(CookieParser());
app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token');
  next();
});
// Connect all our routes to our application
app.use(express.static(__dirname + '/../client/autofill'));
app.use('/static',express.static(__dirname + '/../client/autofill'));

app.use('/api', routes);
//app.use('*',http404.notFoundMiddleware);
// Open one database connection
// one connection handles all request
MongoClient.connectAsync(config.dbURL)
	.then(function (db){
		module.exports = {db: db};

		app.listen(config.port,function(){
			console.log('Express server listening on port '+ config.port);
			console.log('env = ' + app
				.get('env') + 
				'\n__dirname = ' + __dirname + 
				'\nprocess.cwd = ' + process.cwd());
		});
	})
	.catch(function(err){
		console.log(err);
	});
	




