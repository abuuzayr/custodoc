var autofill = require('express').Router();
//import modules
var config = require('../../config.js');
var sendError = require('../../utils/connection.js');
var connection = require('../../utils/connection.js')();
var http404 = require('../../utils/404.js')();

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
				sendError(req,res,400,err.message,'Unsuccessful');
			});		

	});
});

//element CRUD endpoints
autofill.route('/element')
	.get(function(req,res){
		connection.Do(function(db){
			db.collection('element')
				.find({}, {_id:0})
				.toArray()
				.then(function(data){
					if(data){
						console.log('autofill element retrieved');
						res.status(200).send(data);
					}
					else
						throw new Error('no autofill element')
				})
				.catch(function(err){
					console.log(err);
					sendError(req,res,400,err.message,'Unsuccessful');
				});
			});	
	})	

	.post(function(req,res){
		connection.Do(function(db){
			db.collection('element')
				.insert(req.body.elementData)
				.then(function(savedElement){
					console.log('Records added');//
					console.log(savedElement);//
					return res.status(200).send('Element saved');
				})
				.catch(function(err){
					console.log(err);//
					return sendError(req,res,400,err.message,'Unsuccessful');
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
					return sendError(req,res,400,err.message,'Unsuccessful');
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
					return sendError(req,res,400,err.message,'Unsuccessful');
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
				return sendError(req,res,400,err.message,'Unsuccessful');
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
					return sendError(req,res,400,err.message,'Unsuccessful');
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
				return sendError(req,res,400,err.message,'Unsuccessful');
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
					return sendError(req,res,400,err.message,'Unsuccessful');
				});
		});
	});

//UNDEFINED API END POINTS
autofill.use('*',http404.notFoundMiddleware);

//export module
module.exports = autofill;

