var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/custodoc';

var entryRouter = express.Router();

entryRouter.route('/')

	// display all entries in the database
	.get(function(req,res,next){
		MongoClient.connect(url, function (err, db){
			assert.equal(null,err);
			console.log("Connected correctly to server");
			var coll = db.collection("entries");
			coll.find().toArray(function(err, documents){
				assert.equal(null,err);
				res.send(documents);
				db.close();
			});
		});
	})

	// updating an entry
	.put(function(req,res,next){
		MongoClient.connect(url, function (err, db){
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var coll = db.collection("entries");
			//var formData = req.body.formData;
			coll.updateOne(
				{"formName" : req.body.formName},
				{
					$set: {
						"lastModified": Date()
					}
				},function(err,result){
					assert.equal(err, null);
					console.log("Updated the form");
					res.send('Saved the form' + req.body.formName);
					db.close();
				});
		});
	})

	// creating an entry
	.post(function(req,res,next){
		MongoClient.connect(url, function (err, db){
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var coll = db.collection("entries");
			var formDb = db.collection("forms");  
			var groupName = req.body.groupName;
			coll.findOne({groupName: groupName}, function(err, item) {
				assert.equal(null, err);
				if(item){
					res.send("Existed");
					db.close();
				} else{
					formDb.findOne({groupName: groupName}, function(err, data) {
						assert.equal(null, err);
						
						var entryData={
							groupName     : groupName,
							formName      : data.formName,
							elements      : data.elements,
							numberOfPages : data.numberOfPages,
							creationDate  : Date(),
							lastModified  : Date()
						}
						coll.insert(entryData, function(err, result) {
							assert.equal(err, null);
							console.log("Created new form");
							db.close();
						});

						res.send(entryData);
					});
				}
			});
		});
	})
	
	// deleting an entry
	.delete(function(req,res){
		MongoClient.connect(url, function(err, db){
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var coll = db.collection("entries");
			coll.remove({formName: req.body.formName}, function(err) {
				assert.equal(null, err);
				res.send("Deleted entry: " + req.body.formName);
			});
		});
	});
	
module.exports = entryRouter;
