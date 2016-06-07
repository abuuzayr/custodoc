//403 stands for request forbidden. 
module.exports = function(){

	var service = {
		authenticateToken: authenticateToken,
		verifyAccess: verifyAccess, 
		send403:send403
	};
	return service;

	function authenticateToken(req,res,next){
		var config = require('../config.js');
		var jwt = require('jsonwebtoken');
		var token = req.headers['x-access-token'];

		if(!token) send403(req,res,"No token provided");
		else{
				jwt.verify(token,config.secret,function(err,decoded){
				if(err) send403(req,res,"Failed to authenticate token: " + err);
				else{
					req.decoded = decoded;
					next();
				}
			});
		}
	}

	function verifyAccess(req,res,next){
		var decoded = req.decoded;
		console.log("decoded:");
		console.log(decoded);
		next();
	}

	function send403(req,res,description){
		var data = {
			status: 403,
			message: 'Access Forbidden',
      		description: description,
  		    url: req.url
		}
		res.status(403).send(data);
	}
};