var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = "mongodb://localhost:27017/test";

module.exports = (req,res) => {
	MongoClient.connect(url,function(err,db){
		if(err){
			res.status(400).send("error: can not connect to database");
		}else{
			console.log('Connection established to', url);
			query = res.params.query;
		}
	});
}