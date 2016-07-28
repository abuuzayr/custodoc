var express = require('express');
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var connection = require('../../utils/connection')();
var entryRoutes = express.Router();
var http403 = require('../../utils/403')();
var sendError = require('../../utils/errorHandler.js');

//ACCESS CONTROL
//entryRoutes.use('*',http403.verifyAccess('entrymgmt'));

entryRoutes.route('/')
    // display all entries in the database
    .get(function(req, res, next) {
        connection.Do(function(db) {
            db.collection("entries").find().toArray()
                .then(function(result) {
                    return res.status(200).send(result);
                })
                .catch(function(err) {
                    return res.status(400).send('' + err);
                });
        });
    })
    //creating an entry by specifying the group name that contains the forms that are to be filled by user
    //TODO: add createdAt, createdBy before insert when posting new entry
    .post(function(req, res, next) {
        console.log("Final Data: " + JSON.stringify(req.body));
        connection.Do(function(db) {
            db.collection("entries").insert(req.body)
                .then(function(result) {
                    result.message = 'Successfully created the user!';
                    return res.status(200).send('saved:' + result);
                })
                .catch(function(err) {
                    sendError(req, res, 400, err.message, 'Unsuccessful');
                });
        });
    })
    // deleting many entries
    .delete(function(req, res) {
        connection.Do(function(db) {
            db.collection("entries").remove({}, function(err) {
                assert.equal(null, err);
                res.send("Deleted entry: " + req.body);
            });
        });
    });

entryRoutes.route('/:entryId')
    .get(function(req, res) {
        connection.Do(function(db) {
            db.collection("entries").find({ _id:new ObjectId(req.params.entryId) }).limit(1).next(function(err, doc) {
                if (err)
                    sendError(req, res, 400, err.message, 'Unsuccessful');
                else
                    return res.status(200).send(doc);
            });
        });
    })
    .put(function(req, res) {
        connection.Do(function(db) {
            db.collection("entries").updateOne({ _id:new ObjectId(req.params.entryId) }, {
                $set: {
                    data: req.body.entryData.data,
                    lastModifiedAt: new Date(),
                    lastModifiedBy: req.decoded.username
                }
            }).then(function(result){
                res.status(200).send('updated');
            }).catch(function(err) {
                sendError(req, res, 400, err.message, 'Unsuccessful');
            });
        });
    })
    .delete(function(req, res) {
        connection.Do(function(db) {
            db.collection("entries").deleteOne({ _id:new ObjectId(req.params.entryId) })
                .then(function(result) {
                    res.status(200).send('deleted');
                }).catch(function(err) {
                    sendError(req, res, 400, err.message, 'Unsuccessful');
                });
        });
    });


// route that contains funtions such as retrieving keys, etc
entryRoutes.route('/functions/:groupName')

// get the forms according to the groupName from the forms database
.post(function(req, res, next) {
    connection.Do(function(db) {
        var groupName = req.body.groupName;
        console.log(groupName);
        db.collection("forms").find({ groupName: groupName })
            .toArray()
            .then(function(forms) {              
                return res.status(200).send(forms);
            })
            .catch(function(err) {
                return res.status(400).send('' + err);
            });
    });
});

module.exports = entryRoutes;
