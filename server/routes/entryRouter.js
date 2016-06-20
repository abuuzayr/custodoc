var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/custodoc';

var entryRouter = express.Router();

entryRouter.route('/')
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

	.post(function(req,res,next){
		MongoClient.connect(url, function (err, db){
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var coll = db.collection("entries");
			var formName = req.body.formName;
			coll.findOne({formName: formName}, function(err, item) {
				assert.equal(null, err);
				if(item){
					res.send("Existed");
					db.close();
				} else{
					var entryData={
						formName: formName,
						creationDate:Date(),
						lastModified:Date()
					}
					coll.insert(entryData, function(err, result) {
						assert.equal(err, null);
						console.log("Created new form");
						db.close();
					});

					res.send(entryData);
				}
			});
		});
	})
	
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
