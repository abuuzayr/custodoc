var autofill = require('express').Router();
//import modules
var config = require('../config.js');
var connection = require('./connection.js')();
var http404 = require('../utils/404.js')();


//autofill entry crud endpoints
// autofill.post('/',function)
autofill.route('/')
		.delete(function(req,res){
			connection.Do(function(db){
				var id_arr = req.query.id;
				
				for(var i = 0 ; i < id_arr.length ; i++){
					id_arr[i] = config.ObjectId(id_arr[i]);
				}

				db.collection("autofill").remove({_id:{$in:id_arr}});
				res.status(200).send("success");	
			});
		});
		
//element crud endpoints
autofill.route('/element')
		.get(function(req,res){
			connection.Do(function(db){
				var cursor = db.collection("element").find({}, {fieldname:1, _id:0});
				cursor.toArray(function(err,data){
	    			if (err) {
	        			return res.status(400).send(err);
    			} else {
	    				console.log("element all data");
    					res.status(200).send(data);
    				}
				});	
			})
		})	

		.post(function(req,res){
			connection.Do(function(db){
				var fieldname = req.params.fieldname;
				db.collection("element").insert({fieldname:fieldname},function(err,docs){
					if(err){
						return res.status(400).send(err);	
					}else{
						console.log("Records added: " + docs);
						return res.status(200).send("Records added:" + docs);
					}
				});
			});
		});

//QUERY API END POINTS
autofill.get('/query/:query',function(req,res){
	connection.Do(function(db){
		var query = req.params.query;
			var coll = db.collection("autofill");
    		var cursor = coll.find({});
			cursor.toArray(function(err,data){
		        if (err) {
		            console.log(err);
		            return res(err);
		        } else {
		        	//filter based on keywords
		        	dataArray = data;
		        	var results = [];
		        	query = query.trim().toLowerCase();			
		        	for(var i = 0 ; i < dataArray.length ; i++){
		        		for(fields in dataArray[i]){
		        			 if(fields != "_id"){
		        			 	if(dataArray[i][fields].toString().toLowerCase().indexOf(query)!=-1){
		        			 		results.push(dataArray[i]);
		        			 	}
		        			 }
		        		}	
		        	}	
		            res.send(results);
		        }
    		});
	});
});

autofill.get('/query',function(req,res){
	connection.Do( function(db) { 
		cursor = db.collection("autofill").find();
		cursor.toArray(function(err,data){
        		if (err) {
            		return res.status(400).send(err);
            	return res(err);
        		} else {
        			console.log("all data");
        			res.status(200).send(data);
        		}
		});
	});
});
//UNDEFINED API END POINTS
autofill.use('*',http404.notFoundMiddleware);
//export module
module.exports = autofill;




