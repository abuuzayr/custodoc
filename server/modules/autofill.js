var autofill = require('express').Router();
//import modules
var config = require('../config.js');
var connection = require('../utils/connection.js')();
var http404 = require('../utils/404.js')();

//autofill records QUERY
autofill.get('/query/:query',function(req,res){
	connection.Do(function(db){
		var query = req.params.query;
    		db.collection('autofill')
			.find({})
			.toArray()
			.then(function(data){
				if (!data || data.length === 0 ) {
		            throw new Error('no data found');
		        } else {
		        	var results = [];
		        	query = query.trim().toLowerCase();			
		        	for(var i = 0 ; i < data.length ; i++){
		        		for(fields in data[i]){
		        			if(fields != '_id'){
		        			 	if(data[i][fields].toString().toLowerCase().indexOf(query)!=-1){
		        			 		results.push(data[i]);
		        			 	}
		        			}
		        		}	
		        	}	
		            return res.send(results);
				}
			})
			.catch(function(err){
				res.send(err+'');
			});		

	});
});

//element CRUD endpoints
autofill.route('/element')
	.get(function(req,res){
		connection.Do(function(db){
			db.collection('element')
				.find({}, {fieldname:1, _id:0})
				.toArray()
				.then(function(data){
					console.log('element all data');
					res.status(200).send(data);
				})
				.catch(function(err){
					console.log(err);
					return res.status(400).send(err);
				});
			
			});	
	})	

	.post(function(req,res){
		connection.Do(function(db){
			var fieldname = req.params.fieldname;
			db.collection('element')
				.insert({fieldname:fieldname})
				.then(function(savedDoc){
					console.log('Records added: ' + docs);
					return res.status(200).send('Records added:' + docs);
				})
				.catch(function(err){
					console.log(err);
					return res.status(400).send(err);
				});
		});
	});

//update delete by id
autofill.route('/:record_id')
	//TODO: verify promise	
	.get(function(req,res){
		connection.Do(function(db){
			var id = config.ObjectId(req.params.record_id);
			db.collection('autofill')
				.findOne({ _id: id })
				.then(function(doc){
					res.status(200).send(doc);	
				})
				.catch(function(err){
					return res.status(400).send(err);
				});
		})
	})

	.delete(function(req,res){
		connection.Do(function(db){
			var id = config.ObjectId(req.params.record_id);
			db.collection('autofill')
				.findOneAndDelete({_id:id})
				.then(function(result){
					console.log(result)
					res.send(200).send(result);
				})
				.catch(function(err){
					return res.status(400).send(err);
				})
		});
	})


	//TODO: verify promise
	.put(function(req,res){
		connection.Do(function(db){
			var recordData = req.body;
			recordData._id = config.ObjectId(req.params.record_id);

			db.collection('autofill')
			.findOneAndUpdate(
			{
				_id: recordData._id
			},
			recordData,
			{
				upsert:true,
				returnOriginal:false
			})
			.then(function(newDoc){
				return res.status(200).send('Records updated:' + newDoc.value);
			})
			.catch(function(err){
				console.log(err);
				return res.status(400).send(err);
			})
		})		
	});
		
//autofill entry CRUD endpoints
autofill.route('/')
	//Get all
	.get(function(req,res){
		connection.Do( function(db) { 
			db.collection('autofill')
				.find({})
				.toArray()
				.then(function(docs){
					console.log('all data');
	        		res.status(200).send(docs);
				})
				.catch(function(err){
					return res.status(400).send(err);
				});
		});
	})

	//Create new
	.post(function(req,res){
		db.collection('autofill')
			.insertOne(req.body.recordData)
			.then(function(savedDoc){
				res.status(200).send('success: ' + savedDoc + 'documents removed');		
			})
			.catch(function(err){
				return res.status(400).send(err);
			});
	})

	//Delete many
	.delete(function(req,res){
		connection.Do(function(db){
			var id_arr = req.query.id;
			for(var i = 0 ; i < id_arr.length ; i++){
				id_arr[i] = config.ObjectId(id_arr[i]);
			}
			// res.status(200).send('success');	
			db.collection('autofill')
				.deleteMany({_id:{$in:id_arr}})
				.then(function(results){
					res.status(200).send('success: ' + results.n + 'documents removed');	
				})
				.catch(function(err){
					return res.status(400).send(err);
				});
		});
	});

//UNDEFINED API END POINTS
autofill.use('*',http404.notFoundMiddleware);

//export module
module.exports = autofill;

