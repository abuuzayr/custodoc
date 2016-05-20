const autofill = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = "mongodb://localhost:27017/test";


autofill.use("/query/:query",QueryKeywords);
autofill.use("/query",QueryAll);

module.exports = autofill;

function QueryKeywords(req,res,next){
	MongoClient.connect(url,function(err,db){
		if(err){
			res.status(400).send("error: can not connect to database");
		}else{
			console.log('Connection established to', url);
			//TODO
			var query = req.params.query;
			var coll = db.collection("restaurants");
    		var cursor = coll.find({$or: [{'address.building':query},{'cuisine':query},{'name':query}]});
			cursor.toArray(function(err,data){
		        if (err) {
		            console.log(err);
		            return res(err);
		        } else {
		        	console.log("keywords data2: ");
		        	console.log(data);
		            res.send(data);
		        }
    		});
    	}	//////
	});
}

function QueryAll(req,res,next){
	MongoClient.connect(url,function(err,db){
		if(err){
			res.status(400).send("error: can not connect to database");
		}else{
			console.log('Connection established to', url);
			//TODO
			var cursor = db.collection("restaurants").find();
			cursor.toArray(function(err,data){
        		if (err) {
            		return res.status(400).send(err);
            	return res(err);
        		} else {
        			console.log("all data");
        			res.status(200).send(data);
        		}
    		});
			//////
		}
	});
}



