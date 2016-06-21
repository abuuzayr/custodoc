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
			db.collection("entries").find().toArray(function(err, documents){
				assert.equal(null,err);
				console.log(JSON.stringify(documents));
				res.send(documents);
			});
		});
	})
	/*TODO: UPDATE INCOMPLETE
	// updating an entry
	.put(function(req,res,next){
		connection.Do(function(db){
			var coll = db.collection("entries");
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
	}) */

	// creating an entry by specifying the group name that contains the forms that are to be filled by user
	.post(function(req,res,next){
		connection.Do(function(db){
			var groupName=req.body.groupName;
			var entryData={
				groupName     : groupName,	
				creationDate  : Date(),
				lastModified  : Date()
			};
			var country = 'Country';
			console.log(req.body.country);
			entryData[country] = req.body.country;

			//TODO: retrieve arrayOfKeys from somewhere
			//TODO: get the respective req.body.fieldName for each fieldName, 
			/*for (var i=0; i<arrayOfKeys.length; i++) {
				entryData[arrayOfKeys[i]] = req.body.fieldName;
			}*/
			return db.collection("entries").insert(entryData)			
		})
		.then(function(result){
			return res.status(200).send('saved:' + result);
		})
		.catch(function(err){
			return res.status(400).send(''+err);
		});
	})
	
	// deleting an entry
	.delete(function(req,res){
		connection.Do(function(db){
			db.collection("entries").remove({groupName: req.body.groupName}, function(err) {
				assert.equal(null, err);
				res.send("Deleted entry: " + req.body.groupName);
				console.log("Deleted entry: " + req.body.groupName);
			});
		});
	});

// route that contains funtions such as retrieving keys, etc
entryRouter.route('/functions')

	// get the keys a.k.a field names from the forms database
	.post(function(req,res,next){
		connection.Do(function(db){
			var groupName = req.body.groupName;
			console.log(groupName);
			db.collection("forms").find({groupName: groupName})
			.toArray()
			.then(function(docs){
				if(docs.length == 0 || !docs)
					throw new Error('No documents found!')
				else{
					console.log('wat is docs: '+docs.length);
					var key;
					var arrayOfKeys = [];
					for (var i = 0; i < docs.length ; i++){
						var data = docs[i];
						var elements = data.elements;
						for (key in elements) {
							var element = elements[key];
							if (element.name.startsWith('text_')) {
								var index = element.name.indexOf('_');
								var fieldName = element.name.substring(index+1, element.name.length);
								//TODO: check duplication
								console.log(fieldName);
								arrayOfKeys.push(fieldName);
							}
						}
					}
					return arrayOfKeys;
				}
			})
			.then(function(result){
				console.log('did i come here ' + result);
				res.status(200).send(result);
			})
			.catch(function(err){
				return res.status(400).send(''+err);
			});

		});
	})
	
	
						
module.exports = entryRouter;
