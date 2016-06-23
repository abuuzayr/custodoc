var entryrecordsRoutes = require('express').Router();
//import modules
var config = require('../config.js');
var connection = require('../utils/connection.js')();
var http404 = require('../utils/404.js')();

//CRUD
entryrecordsRoutes.route('/')
	.get(function(req,res){
		connection.Do(function(db){
    		db.collection('autofill')
			.mapReduce(
				function(){
					for (var key in this)
						emit(key, null);
				},
				function(key){
					return null;
				},
				{
					query: {},
					out: 'keys'
				}
			)
			.then(function(){
				res.send('ok');
			})
		});
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

module.exports = entryrecordsRoutes;	
