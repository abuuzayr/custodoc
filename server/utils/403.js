//Include autentication module, 
//access level verification module,
//and 403 ACCESS FORBIDDEN handler.
module.exports = function() {

    var service = {
    	decodeSessionCookie:decodeSessionCookie,
        signIdCookie: signIdCookie,
        checkStroage: checkStroage,
        checkExpiration: checkExpiration,
        decodeAccessInfo: decodeAccessInfo,
        verifyAccess: verifyAccess,
        send403: send403
    };
    return service;

    function decodeSessionCookie(req, res, next) {
        var config = require('../config.js');
        var jwt = require('jsonwebtoken');
        var token = req.cookies.session;
        if (!token)
            send403(req, res, "no token");
        else {
            jwt.verify(token, config.superSecret, function(err, decoded) {
                if (err) {
                    return send403(req, res, err.message);
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    }

    function signIdCookie(req, res, next) {
        var config = require('../config.js');
        var jwt = require('jsonwebtoken');
        jwt.sign({
            userId: req.decoded._id,
            username: req.decoded.username,
            email: req.decoded.email,
            usertype: req.decoded.usertype
        }, config.appSecret, {
            expiresIn: '1h'
        }, function(err, token) {
            if (err) {
                return send403(req, res, err.message);
            }
            res.cookie('id', token, { maxAge: 360000, httpOnly: false });
            next();
        });
    }


    function checkStroage(req, res, next) {
        var connection = require('./connection')();
        connection.Do(function(db) {
            return next();
        });
    }

    function checkExpiration(req, res, next) {
        var connection = require('./connection')();
        connection.Do(function(db) {
            return next();
        });
    }

    function decodeAccessInfo(req, res, next) {
        var crypto = require('crypto');
        var config = require('../config.js');
        var algorithm = 'aes-256-ctr';  
        var ecodedAccessInfo = req.decoded.application;
        var decipher = crypto.createDecipher(algorithm, config.appSecret);
        try {
            var decodedAccessInfo = decipher.update(ecodedAccessInfo, 'hex', 'utf8');
            decodedAccessInfo += decipher.final('utf8');
            req.accessInfo = JSON.parse(decodedAccessInfo);
            return next();
        } catch (err) {
            console.log(err); //TOFIX
            return send403(req, res, "Authentication failed with error: " + err.message);
        }
    }

    function verifyAccess(moduleName) {
        return function(req, res, next) {
            var module = req.accessInfo[moduleName];
            switch (req.method) {
                case 'GET':
                    console.log('GET', module.read, module.read === true);
                    if (module.read === true)
                        next();
                    else
                        send403(req, res, 'Unauthorized user group');
                    break;
                case 'POST':
                    console.log('POSt'); //TOFIX
                    if (module.create === true)
                        next();
                    else
                        send403(req, res, 'Unauthorized user group');

                    break;
                case 'PUT':
                    console.log('PUt'); //TOFIX
                    if (module.update === true)
                        next();
                    else
                        send403(req, res, 'Unauthorized user group');

                    break;
                case 'DELETE':
                    console.log('DELETe'); //TOFIX
                    if (module.delete === true)
                        next();
                    else
                        send403(req, res, 'Unauthorized user group');
                    break;
                default:
                    return send403(req, res, 'Invalid request');
            }
        };
    }

    function send403(req, res, description) {
        var data = {
            status: 403,
            message: 'Access Forbidden',
            description: description,
            url: req.url
        };
        res.status(403).send(data);
    }

};
