module.export = function(){
	var service = { authenticateToken: authenticateToken};

	function authenticateToken(req,res,next){
		var token = req.body.token;
		if(!token) send403(req,res,"No token presented");
		else{
			
		}
	}

	function send403(req,res,description){
		var data = {
			status: 403,
			message: 'Access Forbidden',
      		description: description,
  		    url: req.url
		}


	}
};