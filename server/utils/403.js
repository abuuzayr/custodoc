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
		var token = req.cookies['access-token'];
		console.log('Authenticate User');//TOFIX
		//console.log(token);//TOFIX

		if(!token)
			send403(req,res,"no token");
		else{
			jwt.verify(token,config.superSecret,function(err, decoded){
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
		console.log('decodeing access info');//TOFIX	
		var ecodedAccessInfo = req.decoded.application;
		console.log(ecodedAccessInfo);//TOFIX
		var decipher = crypto.createDecipher(algorithm,config.appSecret);
		try{
			var decodedAccessInfo = decipher.update(ecodedAccessInfo,'hex','utf8');
			decodedAccessInfo += decipher.final('utf8');
			req.accessInfo = JSON.parse(decodedAccessInfo);
			console.log(req.accessInfo);
			return next();
		}catch(err){
			console.log(err);//TOFIX
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
