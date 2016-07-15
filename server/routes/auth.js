var authRoutes = require('express').Router();
//import modules
var auth = require('../utils/403.js')();
var http404 = require('../utils/404.js')();
var http403 = require('../utils/403.js')();

authRoutes.use('/',http403.authenticateToken,function(req,res){
	res.sendStatus(200);
});

module.exports = authRoutes;