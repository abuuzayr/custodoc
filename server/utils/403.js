//Include autentication module, 
//access level verification module,
//and 403 ACCESS FORBIDDEN handler.
module.exports = function(){

	var service = {
		authenticateToken: authenticateToken,
		checkStroage: checkStroage,
		checkExpiration: checkExpiration,
		verifyAccess: verifyAccess, 
		send403:send403
	};
	return service;

	function authenticateToken(req,res,next){
		var config = require('../config.js');
		var Promise = require('bluebird');
		var jwtVerifyAsync = Promise.promisify(jwt.verify);
		//var token = req.headers['x-access-token'];
		var cookies = req.cookies

		//if(!token) 
		if(!cookies)
			send403(req,res,"No token provided");
		else{
			jwtVerifyAsync(token,config.secret)
			.then(function(decoded){
				req.decoded = decoded;
				return next();
			})
			.catch(function(err){
				send403(req,res,"Authentication failed: " + err );
			});	
		}		
	}

	function decodeAccessInfo(req,res,next){
		var crypto = require('crypto');
		var config = require('../config.js');
		var algorithm = 'aes-256-ctr';
		
		var ecodedAccessInfo = req.decoded;
		var decipher = crypto.createDecipher(algorithm,config.appSecret);
		try{
			var decodedAccessInfo = decipher.update(ecodedAccessInfo,'hex','utf8');
			decodedAccessInfo += decipher.final('utf8');
			req.accessInfo = decodedAccessInfo;
			next();
		}catch(err){
			send403(req,res,"Authentication failed: " + err );
		}
	}

	function checkStroage(req,res,next){
		var connection = require('./connection')();
			connection.Do(function(db){

		})
	}

	function checkExpiration(req,res,next){
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