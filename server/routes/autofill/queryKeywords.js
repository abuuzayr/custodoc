// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/test";

// module.exports = QueryKeywords;

// function QueryKeywords(req,res,next){
// 	MongoClient.connect(url,function(err,db){
// 		if(err){
// 			res.status(400).send("error: can not connect to database");
// 		}else{
// 			//TODO
// 			var query = req.params.query;
// 			var coll = db.collection("restaurants");
//     		var cursor = coll.find({$or: [{'address.building':query},{'cuisine':query},{'name':query}]});
// 			cursor.toArray(function(err,data){
// 		        if (err) {
// 		            console.log(err);
// 		            return res(err);
// 		        } else {
// 		        	console.log("keywords data2: ");
// 		        	console.log(data);
// 		            res.send(data);
// 		        }
//     		});
//     	}	//////
// 	});
// }

