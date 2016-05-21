const autofill = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

//import modules
const QueryKeywords = require('./QueryKeywords');
const QueryAll = require('./QueryAll');
//add routes
autofill.use("/query/:query",QueryKeywords);
autofill.use("/query",QueryAll);

module.exports = autofill;




