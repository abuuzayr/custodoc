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
				console.log(JSON.stringify(documents));
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
		MongoClient.connect(url, function (err, db){
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var coll = db.collection("entries");
			var formDb = db.collection("forms"); 
			var groupName = req.body.groupName;
			console.log(formDb);
			var entryData={
				groupName     : groupName,	
				creationDate  : Date(),
				lastModified  : Date()
			};

			formDb.findOne({groupName: groupName}, function(err, data){
				assert.equal(null, err);
				console.log('wat here ' +data);
				var key;
				var elements = data.elements;
				
				console.log(data.formName);	
				for (key in elements) {
					var element = elements[key];
					console.log("did i come here?");	
					if (element.name.startsWith('text_')) {
						var index = element.name.indexOf('_');
						var fieldName = element.name.substring(index + 1, element.name.length);
					//	if (fieldName == 	
						entryData.fieldName = req.body.fieldName;
						console.log(entryData.fieldName);
					}
				}

				coll.insert(entryData, function(err, result) {
					assert.equal(err, null);
					console.log("entryData: " + JSON.stringify(entryData));
					console.log("Created new form");
					res.send(entryData);
					db.close();
				});
			});

		});
	})
	
	// deleting an entry
	.delete(function(req,res){
		MongoClient.connect(url, function(err, db){
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var coll = db.collection("entries");
			coll.remove({groupName: req.body.groupName}, function(err) {
				assert.equal(null, err);
				res.send("Deleted entry: " + req.body.groupName);
				console.log("Deleted entry: " + req.body.groupName);
			});
		});
	});
	
module.exports = entryRouter;
