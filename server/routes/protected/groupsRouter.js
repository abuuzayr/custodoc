var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var groupsRouter = express.Router();
groupsRouter.route('/')
	.get(function(req,res,next){
		var db = require('../../server.js').db;
		var coll = db.collection("groups");
		coll.find().toArray(function(err, documents){
			assert.equal(null,err);
			res.send(documents);
		});
	})
	.put(function(req,res,next){
		var db = require('../../server.js').db;
		var coll = db.collection("groups");
		var originalName = req.body.originalName;
		var newName = req.body.newName;
		coll.findOne({groupName:newName}, function(err, item) {
			assert.equal(null, err);
			if(item){
				res.send("Existed");
			}else{
				coll.updateOne(
					{"groupName" : originalName},
					{
						$set: { 
							"groupName": newName
						}
					},function(err,result){
						assert.equal(err, null);
						console.log("Renamed a group");
					});
				var coll2 = db.collection("forms");
				coll2.updateMany(
					{"groupName" : originalName},
					{
						$set: { 
							"groupName": newName
						}
					},function(err,result){
						assert.equal(err, null);
						res.send('Renamed a group');
					});
				// var coll3 = db.collection("entries");
				// coll3.updateMany({},{},function(){});
			}
		});
	})
	.post(function(req, res, next){
		var db = require('../../server.js').db;
		var coll = db.collection("groups");
		var groupName = req.body.groupName;
		coll.findOne({groupName: groupName}, function(err, item) {
			assert.equal(null, err);
			if(item){
				res.send("Existed");
				console.log("Existed");
			}else{
				coll.insert({groupName: groupName}, function(err, result) {
					assert.equal(err, null);
					res.send("Save:"+groupName);
					console.log("Saved new form");
				});
			}
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

groupsRouter.route('/:groupName')
	.get(function(req, res, next){
		var groupName = req.params.groupName;
		var db = require('../../server.js').db;
		var coll = db.collection("groups");

	})
	.delete(function(req,res,next){
		var groupName = req.params.groupName;
		var db = require('../../server.js').db;
		var coll = db.collection("groups");
		coll.deleteOne({"groupName":groupName},function(err,result){
			assert.equal(null,err);
		});
		coll2 = db.collection('forms');
		coll2.deleteMany({'groupName':groupName},function(err,result){
			assert.equal(null,err);
			res.send(groupName);
		});
		// coll3 = db.collection('entries');
		// coll3.deleteMany({},function(){});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

groupsRouter.route('/getGroupForms/:groupName')
	.get(function(req, res, next){
		var groupName = req.params.groupName;
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		coll.find({groupName: groupName}).sort({order: 1}).toArray(function(err, forms){
			assert.equal(null,err);
			res.status(200).send(forms);
		});
	});

groupsRouter.route('/getGroupElements/:groupName')
	.get(function(req, res, next){
		var groupName = req.params.groupName;
		var db = require('../../server.js').db;
		var coll = db.collection("forms");
		coll.find({groupName: groupName}).sort({order: 1}).toArray(function(err, forms){
			assert.equal(null,err);
			var elements = [];
			var elementNames = [];
			if (forms) {
				for(var i=0; i<forms.length; i++){
					var formElements = forms[i].elements;
					for(key in formElements){
						if (elementNames.indexOf(formElements[key].name)<0 && (key.startsWith("text") || key.startsWith("dropdown") || key.startsWith("radio") || key.startsWith("checkbox"))) {
							elementNames.push(formElements[key].name);
							elements.push(formElements[key]);
						}
					}
				}
			}
			console.log(elements);
			res.status(200).send(elements);
		});
	});

module.exports=groupsRouter;
