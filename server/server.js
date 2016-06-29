var hostname = 'localhost';
var port = 3000;
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var assert = require('assert');
var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient;
Promise.promisifyAll(MongoClient);
var assert = require('assert');
var app = express();
var url = 'mongodb://localhost:27017/custodoc';
var formsRouter = require('./routes/formsRouter');
var groupsRouter = require('./routes/groupsRouter');
var autofillRouter = require('./routes/autofill');
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
app.use('/autofill', autofillRouter);
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

MongoClient.connectAsync(url)
	.then(function (db){
		module.exports = {db: db};
		app.listen(port, hostname, function(){
			console.log(`Server running at http://${hostname}:${port}/`);
		});
	})
	.catch(function(err){
		console.log(err);
	});

