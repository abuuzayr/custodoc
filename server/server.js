'use strict';
var express = require('express');
var app = express();
var port = process.env.PORT || 8001;
var environment = process.env.NODE_ENV;
//  Import modules
const routes = require('./routes');
//  Connect all our routes to our application
app.use('/api', routes);

app.listen(port,function(){
	console.log('Express server listening on port '+ port);
	console.log('env = ' + app.get('env') + 
		'\n__dirname = ' + __dirname + 
		'\nprocess.cwd = ' + process.cwd());
});
