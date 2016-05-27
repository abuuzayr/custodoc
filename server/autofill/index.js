const autofill = require('express').Router();
//import modules
const config = require('../config.js');
const Auth = require('../utils/403.js')();
const query = require('./query')();
//add routes

//Auth endpoints
autofill.use(function(req,res,next){ Auth.authenticateToken(req,res,next)});
//autofill entry crud endpoints
// autofill.post('/',function)
autofill.route('/')
		.delete(function(req,res,next){
			var MongoClient = require('mongodb').MongoClient;
			var url = "mongodb://localhost:27017/test";
			MongoClient.connect(url,function(err,db){
				if(err){
					res.status(400).send("error: can not connect to database");
				}else{
					var id_arr = req.query.id;
					console.log(typeof id_arr[1]);
					console.log(id_arr);

					for(var i = 0 ; i < id_arr.length ; i++){
						id_arr[i] = config.ObjectId(id_arr[i]);
					}
					console.log(typeof id_arr[1]);

					db.collection("autofill").remove({_id:{$in:id_arr}});
					res.status(200).send("success");	
				}
			});
		});

//element crud endpoints
autofill.route('/element')
		.get(function(req,res){
			config.MongoClient.connect(config.dbURL,function(err,db){
				if(err){
					res.status(400).send("error: can not connect to database");
				}else{
					console.log('Connection established to', config.dbURL);
				//TODO
					var cursor = db.collection("element").find({}, {fieldname:1, _id:0});
					cursor.toArray(function(err,data){
	        			if (err) {
	            			return res.status(400).send(err);
	        			} else {
	        				console.log("element all data");
	        				res.status(200).send(data);
	        			}
    				});	
				}
			});
		})

		.post(function(req,res){
			config.MongoClient.connect(config.dbURL,function(err,db){
				if(err){
					res.status(400).send("error: can not connect to database");
				}else{
					console.log('Connection established to', config.dbURL);
				//TODO
					var fieldname = req.params.fieldname;
					db.collection("element").insert({fieldname:fieldname},function(err,docs){
						if(err){
							return res.status(400).send(err);	
						}else{
							console.log("Records added: " + docs);
							return res.status(200).send("Records added:" + docs);
						}
					});
				}});		
			});
//query api endpoints
autofill.get('/query/:query',query.QueryKeywords);
autofill.get('/query',query.QueryAll);





autofill.use('/*', function(req,res){ http404.notFoundMiddleware(req,res); });
//export module
module.exports = autofill;




