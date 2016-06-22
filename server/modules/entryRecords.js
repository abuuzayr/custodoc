var entryrecordsRoutes = require('express').Router();
//import modules
var config = require('../config.js');
var connection = require('../utils/connection.js')();
var http404 = require('../utils/404.js')();

//CRUD
entryrecordsRoutes.route('/')
	.get(function(req,res){

	})
	.post(function(req,res){

	})
	.delete(function(req,res){

	});

entryrecordsRoutes.route('/:id')
	.get(function(req,res){

	})
	.put(function(req,res){

	});
