var usermgmtRoutes = require('express').Router();
//import modules
var config = require('../../config.js');
var sendError = require('../../utils/errorHandler.js');
var connection = require('../../utils/connection.js')();
var http404 = require('../../utils/404.js')();

usermgmtRoutes.route('/')
	.get(function(req,res){

	})
	.post(function(req,res){

	})
	.delete(function(req,res){

	});
usermgmtRoutes.route('/:userId')	
	.get(function(req,res){

	})
	.put(function(req,res){

	})
	.delete(function(req,res){

	});

module.exports = usermgmtRoutes;	