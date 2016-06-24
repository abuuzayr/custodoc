var express = require('express');
var app = express();

app.use(express.static(__dirname + '../client'))
app.use('/', express.static(__dirname + '/../client'));

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
        next();
});

app.listen(3000, function(){
	console.log("express server on port 3000");
});
