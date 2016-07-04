//Include autentication module, 
//access level verification module,
//and 403 ACCESS FORBIDDEN handler.
module.exports = function(){

	var service = {
		authenticateToken: authenticateToken,
		checkStroage: checkStroage,
		checkExpiration: checkExpiration,
		decodeAccessInfo: decodeAccessInfo,
		send403:send403
	};
	return service;

	function authenticateToken(req,res,next){
		var config = require('../config.js');
		var jwt = require('jsonwebtoken');
		var cookies = req.cookies
		console.log(cookies);//TOFIX

		if(!cookies)
			send403(req,res,"no cookies");
		else{
			jwt.verify(token,config.secret,function(err, decoded){
				if(err){
					return send403(req,res,"Authentication failed with error: " + err.message);
				}
				else{
					req.decoded = decoded;
					return next();
				}
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
			req.accessInfo = JSON.parse(decodedAccessInfo);
			return next();
		}catch(err){
			return send403(req,res,"Authentication failed with error: " + err.message);
		}
	}

	function checkStroage(req,res,next){
		var connection = require('./connection')();
			connection.Do(function(db){
				return next()
		});
	}

	function checkExpiration(req,res,next){
		var connection = require('./connection')();
			connection.Do(function(db){
				return next()
		});
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