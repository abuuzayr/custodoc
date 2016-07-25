module.exports = function(req,res,status,errDescription,msg){
	return res.status(status).send({
			message: msg,
      		description:errDescription,
  		    url: req.url
	}); 
}; 
//description: String
//msg: String