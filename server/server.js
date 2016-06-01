'use strict';
// Import packages 
var express = require('express');
var https = require('https');
var bodyParser = require('body-parser');
var app = express();

//  Import custom modules
var config = require('./config');
var routes = require('./api');
var http404 = require('./utils/404')();
// const http403 = require('./utils/403')();


// Configuration
//app.use(morgan('combined'));
app.use(bodyParser.json());
app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token');
  next();
});

//  Connect all our routes to our application
app.use('/api', routes);
app.use(express.static('../client/autofill/'));
app.use('/*',express.static('../client/autofill/index.html'));

/*
app.listen(config.port,function(){
	console.log('Express server listening on port '+ config.port);
	console.log('env = ' + app.get('env') + 
		'\n__dirname = ' + __dirname + 
		'\nprocess.cwd = ' + process.cwd());
});

*/

https.createServer(app).listen(config.port);