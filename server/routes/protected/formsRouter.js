var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var formsRouter = express.Router();

formsRouter.route('/')
	.get(function(req,res,next){
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		coll.find().toArray(function(err, documents){
			assert.equal(null,err);
			for(var i=0;i<documents.length;i++){
				delete documents[i].elements;
			}
			res.send(documents);
		});
	})
	.put(function(req,res,next){
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		var formData = req.body.formData;
		coll.updateOne(
			{"formName" : formData.formName, "groupName":formData.groupName},
			{
				$set: {
					"numberOfPages": formData.numberOfPages,
					"elements": formData.elements,
					"lastModified": Date()
				}
			},function(err,result){
				assert.equal(err, null);
				console.log(result);
				if(result.matchedCount === 0) res.status(404).send('Not found');
				else res.send('Saved the form: ' + req.body.formData.formName);
			});
	})
	.post(function(req, res, next){
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		var formName = req.body.formData.formName;
		var groupName = req.body.formData.groupName;
		coll.findOne({formName: formName,groupName:groupName}, function(err, item) {
			assert.equal(null, err);
			if(item){
				res.send("Existed");
			}else{
				var formData={
					formName:formName,
					groupName:groupName,
					elements: {},
					isImportant: 'Normal',
					creationDate:Date(),
					lastModified: Date(),
					numberOfPages:1
				}
				coll.insert(formData, function(err, result) {
					assert.equal(err, null);
					res.send({groupName:groupName,formName:formName});
					console.log("Created new form");
				});
			}
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});
formsRouter.route('/rename')
	.put(function(req,res,next){
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		var originalName = req.body.originalName;
		var newName = req.body.newName;
		var groupName=req.body.groupName;
		coll.findOne({formName:newName, groupName:groupName}, function(err, item) {
			assert.equal(null, err);
			if(item){
				res.send("Existed");
			}else{
				coll.updateOne(
					{"formName" : originalName},
					{
						$set: { 
							"formName": newName
						}
					},function(err,result){
						assert.equal(err, null);
						console.log("Renamed a form");
						res.send('Renamed a group');
					});
				// var coll2 = db.collection("entries");
				// coll2.updateMany(
				// 	{"formName" : originalName},
				// 	{
				// 		$set: { 
				// 			"formName": newName
				// 		}
				// 	},function(err,result){
				// 		assert.equal(err, null);
				// 	});
			}
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

formsRouter.route('/duplicate')
	.post(function(req,res,next){
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		var duplicateFrom = req.body.duplicateFrom;
		var formName = req.body.formName;
		var duplicateName=req.body.duplicateName;
		var duplicateTo=req.body.duplicateTo;
		coll.findOne({formName:formName, groupName:duplicateFrom}, function(err, item) {
			assert.equal(null, err);
			if(!item){
				res.send("Cannot find");
			}else{
				coll.findOne({formName:duplicateName, groupName:duplicateTo}, function(err, result) {
					if(result){
						res.send('Existed');
					}else{
						var newItem = item;
						delete newItem["_id"];
						newItem.groupName = duplicateTo;
						newItem.formName = duplicateName;
						newItem.isImportant = 'Normal';
						newItem.creationDate = Date();
						newItem.lastModified = Date();
						coll.insert(newItem, function(err, result) {
							assert.equal(null,err);
							res.send("Duplicated:"+formName);
							console.log("Duplicated the form");
						});
					}
				});
			}
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

formsRouter.route('/important')
	.put(function(req,res,next){
		var formName=req.body.formName;
		var groupName=req.body.groupName;
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		coll.updateOne({
			'formName': formName,
			'groupName': groupName
		},{
			$set: { 
				"isImportant": 'Important'
			}
		},function(err,results){
			assert.equal(err, null);
			console.log(results);
			res.send(results);
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

formsRouter.route('/normal')
	.put(function(req,res,next){
		var formName=req.body.formName;
		var groupName=req.body.groupName;
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		coll.updateOne({
			'formName': formName,
			'groupName': groupName
		},{
			$set: { 
				"isImportant": 'Normal'
			}
		},function(err,results){
			assert.equal(err, null);
			console.log(results);
			res.send(results);
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

formsRouter.route('/:groupName/:formName')
	.get(function(req,res,next){
		var groupName = req.params.groupName;
		var formName = req.params.formName;
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		coll.findOne({formName: formName,groupName:groupName}, function(err, item) {
			assert.equal(null, err);
			if(item){
				res.send(item);
			}else{
				res.status(404).send({ error: 'Cannot find the form' });
			}
		});
	})
	.delete(function(req,res,next){
		var groupName = req.params.groupName;
		var formName = req.params.formName;
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		coll.deleteOne({"groupName":groupName,"formName":formName},function(err,result){
			assert.equal(null,err);
			res.send(groupName+'/'+formName)
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});
module.exports=formsRouter;
