var jwt = require('jsonwebtoken');
const secret = 'gilbert_what_time_is_it_now';
var token = jwt.sign({
	name: 'danny',
	username: 'danny46'
},secret,{ expiresIn: '24h'});

console.log(token);

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGFubnkiLCJ1c2VybmFtZSI6ImRhbm55NDYiLCJpYXQiOjE0NjM5MjY1NzMsImV4cCI6MTQ2NDAxMjk3M30.AOxFbnolVAbMaA6MQdRWk5YLthUxsQU0N1ZvVMnVI8k