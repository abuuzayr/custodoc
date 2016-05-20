// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var url = "mongodb://localhost:27017/test";

// function QueryAll(req,res){
// 	MongoClient.connect(url,function(err,db){
// 		if(err){
// 			res.status(400).send("error: can not connect to database");
// 		}else{
// 			console.log('Connection established to', url);
// 			//TODO
// 			var cursor = db.collection("restaurants").find();
// 			cursor.toArray(function(err,data){
//         		if (err) {
//             		return res.status(400).send(err);
//             	return res(err);
//         		} else {
//         			console.log(data);
//         			res.json(200).send(data);
//         		}
//     		});
// 			//////
// 		}
// 	});
// }

// module.exports = QueryAll;