'use strict';
// Import packages 
var express = require('express');
var bodyParser = require('body-parser');
var CookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
Promise.promisifyAll(MongoClient);
var assert = require('assert');
var path = require('path');
var logger = require('morgan');
var app = express();
//  Import custom modules
var config = require('./config');
var routes = require('./api');
var formsRouter = require('./routes/formsRouter');
var groupsRouter = require('./routes/groupsRouter');
var autofillRouter = require('./routes/autofill');
var entryRouter = require('./routes/entryRouter');
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
  next();
});
// Connect all our routes to our application
app.use(express.static(__dirname + '/../client/app/autofill'));
app.use(express.static(__dirname + '/../client/app/'));
app.use('/static',express.static(__dirname + '/../client/app/autofill'));

app.use('/forms', formsRouter);
app.use('/groups', groupsRouter);
app.use('/autofill', autofillRouter);
app.use('/entryRouter', entryRouter);
app.use('/api', routes);
//app.use('*',http404.notFoundMiddleware);
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
