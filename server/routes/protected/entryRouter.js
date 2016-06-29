var express = require('express');
var assert = require('assert');
var connection = require('../../utils/connection')();
var entryRoutes = express.Router();
entryRoutes.route('/entries')
	
	// display all entries in the database
	.get(function(req,res,next){
	    connection.Do(function(db){
		db.collection("entries").find().toArray()
	        .then(function(result) {
		    return res.status(200).send(result);
	        })
	        .catch(function(err) {
		    return res.status(400).send(''+err);
	        });
	    })
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
		console.log("Final Data: " + JSON.stringify(req.body));
	    connection.Do(function(db){
		db.collection("entries").insert(req.body)
	    	    .then(function(result){
			result.message = 'Successfully created the user!';
			return res.status(200).send('saved:' + result);
	    	    })
	    	    .catch(function(err){
			return res.status(400).send(''+err);
	    	    });
	    })
	})
	
	// deleting an entry
	.delete(function(req,res){
	    connection.Do(function(db){
		db.collection("entries").remove({groupName: req.body.groupName}, function(err) {
		    assert.equal(null, err);
		    res.send("Deleted entry: " + req.body);
		});
	    });
	})

// route that contains funtions such as retrieving keys, etc
entryRoutes.route('/functions')

	// get the keys a.k.a field names from the forms database
	.post(function(req,res,next){
	    connection.Do(function(db){
		var groupName = req.body.groupName;
		    console.log(groupName);
		    db.collection("forms").find({groupName: groupName})
			.toArray()
			.then(function(forms){
			    if(docs.length == 0 || !forms)
				throw new Error('No documents found!')
			    else{
				console.log('wat is forms: '+forms.length);
				var key;
				var arrayOfKeys = [];
				for (var i = 0; i < forms.length ; i++){
				    var data = forms[i];
				    var elements = data.elements;
				    for (key in elements) {
					var element = elements[key];
					if (element.name.startsWith('text_')) {
					    var index = element.name.indexOf('_');
				    	    var fieldName = element.name.substring(index+1, element.name.length);
					    var noDuplicate = true;
					    // check for duplication here
					    for(var j=0; j<arrayOfKeys.length; j++) {
						if (fieldName !== arrayOfKeys[j]) {
						    continue;
						} else {
						    noDuplicate = false;
						    break;
						}
					    }
	
					    if (noDuplicate) {
					        arrayOfKeys.push(fieldName);
					    }
					}
				    }
				}
				console.log(arrayOfKeys);
				return arrayOfKeys;
			    }
			})
			.then(function(result){
			    console.log('did i come here ' + result);
			    return res.status(200).send(result);
			})
			.catch(function(err){
			    return res.status(400).send(''+err);
			});
		});
	})

entryRoutes.route('/input')	
	// get user input
	.post(function(req,res,next){
	    connection.Do(function(db){
		var userInput = req.body.entValue;
		res.status(200).send(userInput);
  	    });
	});
						
module.exports = entryRoutes;
