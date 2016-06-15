//Include autentication module, 
//access level verification module,
//and 403 ACCESS FORBIDDEN handler.
module.exports = function(){

	var service = {
		authenticateToken: authenticateToken,
		verifyAccess: verifyAccess, 
		send403:send403
	};
	return service;

	function authenticateToken(req,res,next){
		var config = require('../config.js');
		var Promise = require('bluebird');
		var jwtVerifyAsync = Promise.promisify(jwt.verify);
		var token = req.headers['x-access-token'];

		if(!token) 
			send403(req,res,"No token provided");
		
			jwtVerifyAsync(token,config.secret)
				.then(function(decoded){
					req.decoded = decoded;
					next();
				})
				.catch(function(err){
					send403(req,res,"Authentication failed: " + err );
				});
		
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