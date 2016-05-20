const autofill = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = "mongodb://localhost:27017/test";

autofill.get("/query",QueryAll);
autofill.get("/query/:query",QueryKeywords);

module.exports = autofill;

///

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
        			console.log(data);
        			res.status(200).send(data);
        		}
    		});
			//////
		}
	});
}

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
		        	console.log("sending data: ");
		        	console.log(data);
		            res.send(data);
		        }
    		});
    	}	//////
	});
}



