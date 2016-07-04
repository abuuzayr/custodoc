
module.exports = function(){
	var service = {
		verifyAutofill: verifyAutofill,
		verifyFormBuilder: verifyFormBuilder,
		verifyFormMgmt verifyFormMgmt,
		verifyEntryRecords: verifyEntryRecords,
		verifyUserMgmt: verifyUserMgmt
	};

	var config = require('../config');
	var http403 = require('./403');

	function verifyAutofill(req,res,next){
		var usertype = req.accessInfo.usertype;
		if(usertype != 'Admin'){
			return http403.send403(req,res,'Unauthorized user group');
		}else{
			return next();
		}
	}
	function verifyFormBuilder(req,res,next){
		var usertype = req.accessInfo.usertype;
		if(usertype != 'Admin'){
			return http403.send403(req,res,'Unauthorized user group');
		}else{
			return next();
		}
	}
	function verifyFormMgmt(req,res,next){
		var usertype = req.accessInfo.usertype;
		if(usertype != 'Admin'){
			return http403.send403(req,res,'Unauthorized user group');
		}else{
			return next();
		}
	}
	function verifyEntryRecords(req,res,next){
		var usertype = req.accessInfo.usertype;
		if(usertype != 'Admin'){
			return http403.send403(req,res,'Unauthorized user group');
		}else{
			return next();
		}
	}
	function verifyUserMgmt(req,res,next){
		var usertype = req.accessInfo.usertype;
		if(usertype != 'Admin'){
			return http403.send403(req,res,'Unauthorized user group');
		}else{
			return next();
		}
	}
}


//	Autofill: User:User+(can view , can edit, can delete, cannot one shot download all)s