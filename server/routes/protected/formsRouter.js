var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var http403 = require('../../utils/403')();
var connection = require('../../utils/connection.js')();

var formsRouter = express.Router();

//ACCESS CONTROL
//formsRouter.use('*',http403.verifyAccess('formmgmt'));

formsRouter.route('/')
    .get(function(req, res, next) {
        connection.Do(function(db) {
            db.collection("forms").find().sort({ groupName: 1, order: 1 }).toArray(function(err, forms) {
                assert.equal(null, err);
                for (var i = 0; i < forms.length; i++) {
                    delete forms[i].elements;
                }
                res.send(forms);
            });
        });
    })
    .put(function(req, res, next) {
        connection.Do(function(db) {
            var formData = req.body.formData;
            db.collection("forms").updateOne({ "formName": formData.formName, "groupName": formData.groupName }, {
                $set: {
                    "numberOfPages": formData.numberOfPages,
                    "elements": formData.elements,
                    "lastModified": new Date(),
                    "lastModifiedBy": req.decoded.username
                }
            }, function(err, result) {
                assert.equal(err, null);
                console.log(result);
                if (result.matchedCount === 0) res.status(404).send('Not found');
                else res.send('Saved the form: ' + req.body.formData.formName);
            });
        });
    })
    .post(function(req, res, next) {
        var formName = req.body.formData.formName;
        var groupName = req.body.formData.groupName;
        connection.Do(function(db) {
            db.collection("forms").find({
                    formName: formName,
                    groupName: groupName
                })
                .limit(1)
                .next(function(err, item) {
                    assert.equal(null, err);
                    if (item) {
                        res.send("Existed");
                    } else {
                        coll.find({ groupName: groupName }).toArray(function(err, forms) {
                            assert.equal(null, err);
                            if (forms) {
                                var order = 0;
                                for (var i = 0; i < forms.length; i++) {
                                    if (forms[i].order > order) order = forms[i].order;
                                }
                                order++;
                                var formData = {
                                    formName: formName,
                                    groupName: groupName,
                                    elements: {},
                                    isImportant: 'Normal',
                                    creationDate: new Date(),
                                    creator: req.decoded.username,
                                    lastModified: new Date(),
                                    lastModifiedBy: req.decoded.username,
                                    order: order,
                                    numberOfPages: 1
                                };
                                coll.insert(formData, function(err, result) {
                                    assert.equal(err, null);
                                    res.send({ groupName: groupName, formName: formName });
                                    console.log("Created new form");
                                });
                            }
                        });
                    }
                });
        });
    });

formsRouter.route('/rename')
    .put(function(req, res, next) {
        connection.Do(function(db) {
            var originalName = req.body.originalName;
            var newName = req.body.newName;
            var groupName = req.body.groupName;
            db.collection("forms").find({
                    formName: newName,
                    groupName: groupName
                })
                .limit(1)
                .next(function(err, item) {
                    assert.equal(null, err);
                    if (item) {
                        res.send("Existed");
                    } else {
                        coll.updateOne({ "formName": originalName }, {
                            $set: {
                                "formName": newName,
                                "lastModifiedBy": req.decoded.username
                            }
                        }, function(err, result) {
                            assert.equal(err, null);
                            console.log("Renamed a form");
                            res.send('Renamed a group');
                        });
                    }
                });
        });
    });

formsRouter.route('/duplicate')
    .post(function(req, res, next) {
        connection.Do(function(db) {
            var duplicateFrom = req.body.duplicateFrom;
            var formName = req.body.formName;
            var duplicateName = req.body.duplicateName;
            var duplicateTo = req.body.duplicateTo;
            db.collection("forms").find({
                    formName: formName,
                    groupName: duplicateFrom
                })
                .limit(1)
                .next(function(err, item) {
                    if (!item) {
                        res.send("Cannot find");
                    } else {
                        coll.findOne({ formName: duplicateName, groupName: duplicateTo }, function(err, result) {
                            if (result) {
                                res.send('Existed');
                            } else {
                                var newItem = item;
                                delete newItem._id;
                                newItem.groupName = duplicateTo;
                                newItem.formName = duplicateName;
                                newItem.isImportant = 'Normal';
                                newItem.creator = req.decoded.username;
                                newItem.creationDate = new Date();
                                newItem.lastModified = new Date();
                                newItem.lastModifiedBy = req.decoded.username;
                                coll.insert(newItem, function(err, result) {
                                    assert.equal(null, err);
                                    res.send("Duplicated:" + formName);
                                    console.log("Duplicated the form");
                                });
                            }
                        });
                    }
                });
        });
    });

formsRouter.route('/importance')
    .put(function(req, res, next) {
        var db = require('../../server.js').db;
        var coll = db.collection("forms");
        coll.updateOne({
            'formName': req.body.formName,
            'groupName': req.body.groupName,
        }, {
            $set: {
                "isImportant": req.body.importance
            }
        }, function(err, results) {
            assert.equal(err, null);
            console.log(results);
            res.send(results);
        });
    });

formsRouter.route('/:groupName/:formName')
    .get(function(req, res, next) {
        var groupName = req.params.groupName;
        var formName = req.params.formName;
        var db = require('../../server.js').db;
        var coll = db.collection("forms");
        coll.findOne({ formName: formName, groupName: groupName }, function(err, item) {
            assert.equal(null, err);
            if (item) {
                res.send(item);
            } else {
                res.status(404).send({ error: 'Cannot find the form' });
            }
        });
    })
    .delete(function(req, res, next) {
        var groupName = req.params.groupName;
        var formName = req.params.formName;
        var db = require('../../server.js').db;
        var coll = db.collection("forms");
        coll.deleteOne({ "groupName": groupName, "formName": formName }, function(err, result) {
            assert.equal(null, err);
            res.send(groupName + '/' + formName);
        });
    });



module.exports = formsRouter;
