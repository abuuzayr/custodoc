var express = require('express');
//var morgan = require('morgan');
//var bodyParser = require('body-parser');
var url = 'mongodb://localhost:27017/custodoc';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var connection = require('./connection.js')();
var entryRouter = express.Router();
entryRouter.route('/')
	
	// display all entries in the database
	.get(function(req,res,next){
		connection.Do(function(db){
			// MongoClient.connect(url, function (err, db){
			// 	assert.equal(null,err);
			// 	console.log("Connected correctly to server");
			//var coll = db.collection("entries");
			db.collection("entries").find().toArray(function(err, documents){
				assert.equal(null,err);
				console.log(JSON.stringify(documents));
				res.send(documents);
				//db.close();
			});
		});
	})

	// updating an entry
	.put(function(req,res,next){
		connection.Do(function(db){
			// 	MongoClient.connect(url, function (err, db){
			// 	assert.equal(null, err);
			// 	console.log("Connected correctly to server");
			var coll = db.collection("entries");
			//var formData = req.body.formData;
			coll.updateOne(
				{"groupName" : req.body.groupName},
				{
					$set: {
						"lastModified": Date()
					}
				},function(err,result){
					assert.equal(err, null);
					console.log("Updated the form");
					res.send('Saved the form' + req.body.groupName);
					db.close();
				});
		});
	})

	// creating an entry by specifying the group name that contains the forms that are to be filled by user
	.post(function(req,res,next){
		connection.Do(function(db){
			// MongoClient.connect(url, function (err, db){
			// 	assert.equal(null, err);
			// console.log("Connected correctly to server");
			// var coll = db.collection("entries");
			// var formDb = db.collection("forms"); 
			//console.log(formDb);
			var groupName = req.body.groupName;
			var entryData={
				groupName     : groupName,	
				creationDate  : Date(),
				lastModified  : Date()
			};

			//db.collection("forms").findOne({groupName: groupName}, function(err, data){

				// assert.equal(null, err);
				// console.log('wat here ' + data);
			db.collection("forms").find({})
				.toArray()
				.then(function(docs){
					console.log(docs);
	        		res.status(200).send(docs);
				})
				.catch(function(err){
					return res.status(400).send(err);
				});

			// 	var key;
			// 	var elements = data.elements;
			// 	console.log(data);
			// 	console.log(elements);	
			// 	for (key in elements) {
			// 		var element = elements[key];
			// 		console.log("did i come here?");	
			// 		if (element.name.startsWith('text_')) {
			// 			var index = element.name.indexOf('_');
			// 			var fieldName = element.name.substring(index + 1, element.name.length);
			// 		//	if (fieldName == 	
			// 			entryData.fieldName = req.body.fieldName;
			// 			console.log(entryData.fieldName);
			// 		}
			// 	}

			// db.collection("entries").insert(entryData, function(err, result) {
			// 		assert.equal(err, null);
			// 		console.log("entryData: " + JSON.stringify(entryData));
			// 		console.log("Created new form");
			// 		res.send(entryData);
			// 		db.close();
			// 	});
			// });

		});
	})
	
	// deleting an entry
	.delete(function(req,res){
		connection.Do(function(db){
		// MongoClient.connect(url, function(err, db){
		// 	console.log("Connected correctly to server");
			db.collection("entries").remove({groupName: req.body.groupName}, function(err) {
				assert.equal(null, err);
				res.send("Deleted entry: " + req.body.groupName);
				console.log("Deleted entry: " + req.body.groupName);
			});
		});
	});
	
module.exports = entryRouter;
