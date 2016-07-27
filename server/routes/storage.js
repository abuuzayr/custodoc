var storageRoutes = require('express').Router();
//import modules
var sendError = require('../utils/errorHandler.js');
var connection = require('../utils/connection.js')();
var http404 = require('../utils/404.js')();
var http403 = require('../utils/403.js')();
var ObjectID = require('mongodb').ObjectID;
var bson = require('bson')
var BSON = new bson.BSONPure.BSON();

storageRoutes.get('/',http403.decodeSessionCookie,getFormStorage,getEntryStorage,getAutofillStorage,function(req,res){
	return res.status(200).send({
		formStorage: req.formStorage,
		entryStorage: req.entryStorage,
		autofillStorage: req.autofillStorage
	});
});

function getFormStorage(req,res,next){
	connection.Do(function(db){
		db.collection('forms').find({companyId: ObjectID(req.decoded.companyId)}).toArray().then(function(docs){
			req.formStorage = 0;
			if(!docs || docs.length === 0)
				next();
			else{
				for(var i = 0 ; i < docs.length ; i++){
					req.formStorage += BSON.calculateObjectSize(docs[i]);
				}
				next();
			}
		});
	});
}
function getEntryStorage(req,res,next){
	connection.Do(function(db){
		db.collection('entries').find({companyId: ObjectID(req.decoded.companyId)}).toArray().then(function(docs){
			req.entryStorage = 0;
			if(!docs || docs.length === 0)
				next();
			else{
				for(var i = 0 ; i < docs.length ; i++){
					req.entryStorage += BSON.calculateObjectSize(docs[i]);
				}
				next();
			}
		});
	});
}
function getAutofillStorage(req,res,next){
	connection.Do(function(db){
		db.collection('autofill').find({companyId: ObjectID(req.decoded.companyId)}).toArray().then(function(docs){
			req.autofillStorage = 0;
			if(!docs || docs.length === 0)
				next();
			else{
				for(var i = 0 ; i < docs.length ; i++){
					req.autofillStorage += BSON.calculateObjectSize(docs[i]);
				}
				next();
			}
		});
	});
}

module.exports = storageRoutes;
