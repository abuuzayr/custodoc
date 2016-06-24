var hostname = 'localhost';
var port = 3001;
var dbURL = 'mongodb://localhost:27017/custodoc';
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var assert = require('assert');
var app = express();
var entryRouter = require('./routes/entryRouter');
var Promise = require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
app.use(logger('dev'));

app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '../client'))
app.use('/', express.static(__dirname + '/../client'));

app.use('/api', entryRouter);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
	next();
});

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

MongoClient.connectAsync(dbURL)
	.then(function (db){
		module.exports = {db: db};

		app.listen(port,function(){
			console.log('Express server listening on port '+ port);
			console.log('env = ' + app
				.get('env') + 
				'\n__dirname = ' + __dirname + 
				'\nprocess.cwd = ' + process.cwd());
		});
	})
	.catch(function(err){
		console.log(err);
	});
	
