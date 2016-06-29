module.exports = {
	port : process.env.PORT || 3000,
	environment : process.env.NODE_ENV,
	dbURL :'mongodb://localhost:27017/test',
	secret : 'gilbert_what_time_is_it_now',
	ObjectId : require('mongodb').ObjectID
}