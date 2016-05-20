const autofill = require('express').Router();

autofill.get("/",require('./queryAll'));
autofill.get("/:query",require('./queryKeyword'));

module.exports = autofill;