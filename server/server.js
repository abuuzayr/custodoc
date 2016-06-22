var hostname = 'localhost';
var port = 3000;
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();
var formsRouter = require('./routes/formsRouter');
var groupsRouter = require('./routes/groupsRouter');
app.use(logger('dev'));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
	next();
});
app.use('/forms', formsRouter);
app.use('/groups', groupsRouter);
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.listen(port, hostname, function(){
	console.log(`Server running at http://${hostname}:${port}/`);
});