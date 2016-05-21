var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

module.exports = QueryAll;

function QueryAll(req,res,next){
	MongoClient.connect(url,function(err,db){
		if(err){
			res.status(400).send("error: can not connect to database");
		}else{
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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