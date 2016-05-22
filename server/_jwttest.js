var jwt = require('jsonwebtoken');
const secret = 'gilbert_what_time_is_it_now';
var token = jwt.sign({
	name: 'danny',
	username: 'danny46'
},secret,{ expiresIn: '24h'});

console.log(token);

