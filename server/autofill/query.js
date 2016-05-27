//Query Service
module.exports = function(){
	var service = {QueryAll:QueryAll,QueryKeywords:QueryKeywords}
	return service;

function QueryAll(req,res,next){
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/test";
	MongoClient.connect(url,function(err,db){
		if(err){
			res.status(400).send("error: can not connect to database");
		}else{
			
			console.log('Connection established to', url);
			//TODO
			var cursor = db.collection("autofill").find();
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

function QueryKeywords(req,res,next){
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/test";
	MongoClient.connect(url,function(err,db){
		if(err){
			res.status(400).send("error: can not connect to database");
		}else{
			//TODO
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
    	}	//////
	});
}
};