var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/custodoc';
var groupsRouter = express.Router();
groupsRouter.route('/')
	.get(function(req,res,next){
		MongoClient.connect(url, function (err, db){
			assert.equal(null,err);
			console.log("Connected correctly to server");
			var coll = db.collection("groups");
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
		});
	})
	.post(function(req, res, next){
		MongoClient.connect(url, function (err, db){
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var coll = db.collection("groups");
			var groupName = req.body.groupName;
			coll.findOne({groupName: groupName}, function(err, item) {
				assert.equal(null, err);
				if(item){
					res.send("Existed");
					console.log("Existed");
					db.close();
				}else{
					coll.insert({groupName: groupName}, function(err, result) {
						assert.equal(err, null);
						res.send("Save:"+groupName);
						console.log("Saved new form");
						db.close();
					});
				}
			});
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

groupsRouter.route('/:groupName')
	.delete(function(req,res,next){
		var groupName = req.params.groupName;
		MongoClient.connect(url, function (err, db){
			assert.equal(null,err);
			console.log("Connected correctly to server");
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
		});
	})
	.all(function(req,res,next) {		
		if(req.method==="OPTIONS") {
			res.send("");
		}
	});

module.exports=groupsRouter;
