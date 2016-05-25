module.exports = {
	mongodb : require('mongodb'),
	jwt : require('jsonwebtoken'),
	port : process.env.PORT || 8001,
	environment : process.env.NODE_ENV,
	MongoClient : require('mongodb').MongoClient,
	dbURL :'mongodb://localhost:27017/test',
	secret : 'gilbert_what_time_is_it_now'
}