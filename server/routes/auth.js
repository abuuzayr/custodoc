var authRoutes = require('express').Router();
//import modules
var http404 = require('../utils/404.js')();
var http403 = require('../utils/403.js')();

authRoutes.use('/',http403.decodeSessionCookie,http403.signIdCookie,function(req,res){
	res.sendStatus(200);
});

module.exports = authRoutes;