const autofill = require('express').Router();
//import modules
const config = require('../config.js');
const Auth = require('../utils/403.js')();
const query = require('./query')();
//add routes

//Auth endpoints
//autofill.use(function(req,res,next){ Auth.authenticateToken(req,res,next)});
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
	        				console.log("element all data:" + data);
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
//entry crud endpoints
//autofill.route('/')
//query api endpoints
autofill.get('/query/:key',query.QueryKeywords);
autofill.get('/query',query.QueryAll);
autofill.use('/*', function(req,res){ http404.notFoundMiddleware(req,res); });
//export module
module.exports = autofill;




