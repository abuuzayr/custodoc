'use strict';
// Import packages 
var express = require('express');
var jwt = require('jsonwebtoken');
// Decalaration
var app = express();
var port = process.env.PORT || 8001;
var environment = process.env.NODE_ENV;
//  Import modules
const routes = require('./routes');
const four0four = require('./utils/404')();
//  Connect all our routes to our application
app.use('/', routes);
app.use('/*', function(req,res){ four0four.notFoundMiddleware(req,res); });

app.listen(port,function(){
	console.log('Express server listening on port '+ port);
	console.log('env = ' + app.get('env') + 
		'\n__dirname = ' + __dirname + 
		'\nprocess.cwd = ' + process.cwd());
});
