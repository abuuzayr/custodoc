//403 stands for request forbidden. 
module.exports = function(){

	var service = {
		authenticateToken: authenticateToken, 
		send403:send403
	};
	return service;

	function authenticateToken(req,res,next){
		console.log(req.headers);
		var config = require('../config.js');
		console.log(config);
		var token = req.headers['x-access-token'] || req.body.token || req.params.token;
		if(!token) send403(req,res,"No token provided");
		else{
			config.jwt.verify(token,config.secret,function(err,decoded){
				if(err) send403(req,res,"Failed to authenticate token: " + err);
				else{
					console.log('jwt: success');
					console.log(req);
					req.decoded = decoded;
					next();
				}
			});
		}
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