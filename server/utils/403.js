//403 stands for request forbidden. 
module.exports = function(){	
	var service = {
		authenticateToken: authenticateToken, 
		send403:send403
	};
	return service;

	function authenticateToken(req,res,next){
		console.log(req.headers);
		var jsonwebtoken = require('../server.js');
		var token = req.headers['X-Access-Token'] || req.body.token || req.params.token;
		if(!token) send403(req,res,"No token provided");
		else{
			jsonwebtoken.jwt.verify(token,jsonwebtoken.secret,function(err,decoded){
				if(err) send403(req,res,"Failed to authenticate token: " + err);
				else{
					console.log('jwt: success');
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