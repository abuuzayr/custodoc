'use strict';
// Import packages 
var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
// Import packages for Dev
var morgan = require('morgan');

//
var app = express();
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 8001;
var environment = process.env.NODE_ENV;
var MongoClient = mongodb.MongoClient;
var dbURL = 'mongodb://localhost:27017/test';
const secret = 'gilbert_what_time_is_it_now';

//  Import modules
const routes = require('./routes');
const http404 = require('./utils/404')();
// const http403 = require('./utils/403')();


// Configuration
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token');
  next();
});

//  Connect all our routes to our application
app.use('/', routes);
app.use(express.static('../client/autofill/'));
app.use('/*',express.static('../client/autofill/index.html'));

app.listen(port,function(){
	console.log('Express server listening on port '+ port);
	console.log('env = ' + app.get('env') + 
		'\n__dirname = ' + __dirname + 
		'\nprocess.cwd = ' + process.cwd());
});

// Export config
module.exports = {
	jwt:jwt,
	port:port,
	env:environment,
	MongoClient:MongoClient,
	dbURL:dbURL,
	secret:secret
};
