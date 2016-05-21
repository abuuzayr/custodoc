const autofill = require('express').Router();
//import modules
const QueryKeywords = require('./QueryKeywords');
const QueryAll = require('./QueryAll');
//add routes
autofill.use("/query/:query",QueryKeywords);
autofill.use("/query",QueryAll);
//export module
module.exports = autofill;




