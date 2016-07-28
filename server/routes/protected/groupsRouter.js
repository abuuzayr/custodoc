var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var assert = require('assert');
var groupsRouter = express.Router();
var http403 = require('../../utils/403')();


groupsRouter.route('*', http403.verifyAccess('formmgmt'));

groupsRouter.route('/')
    .get(function(req, res) {
        connection.Do(function(db) {
            db.collection("groups").find().toArray(function(err, docs) {
                assert.equal(null, err);
                res.send(docs);
            });
        });
    })
    .put(function(req, res) {
        connection.Do(function(db) {
            var originalName = req.body.originalName;
            var newName = req.body.newName;
            db.collection("groups").findOne({ groupName: newName }, function(err, item) {
                assert.equal(null, err);
                if (item) {
                    res.send("Existed");
                } else {
                    db.collection("groups").updateOne({ "groupName": originalName }, {
                        $set: {
                            "groupName": newName
                        }
                    }, function(err, result) {
                        assert.equal(err, null);
                        console.log("Renamed a group");
                    });
                    var coll2 = db.collection("forms");
                    coll2.updateMany({ "groupName": originalName }, {
                        $set: {
                            "groupName": newName
                        }
                    }, function(err, result) {
                        assert.equal(err, null);
                        res.send('Renamed a group');
                    });
                    // var coll3 = db.collection("entries");
                    // coll3.updateMany({},{},function(){});
                }
            });
        });
    })
    .post(function(req, res) {
        connection.Do(function(db) {
            var groupName = req.body.groupName;
            db.collection("groups").findOne({ groupName: groupName }, function(err, item) {
                assert.equal(null, err);
                if (item) {
                    res.send("Existed");
                    console.log("Existed");
                } else {
                    db.collection("groups").insert({ groupName: groupName }, function(err, result) {
                        assert.equal(err, null);
                        res.send("Save:" + groupName);
                        console.log("Saved new form");
                    });
                }
            });
        });
    });


groupsRouter.route('/:groupName')
    .get(function(req, res) {
        var groupName = req.params.groupName;
        connection.Do(function(db) {
            db.collection("groups").find().toArray(function(err, documents) {
                assert.equal(null, err);
                res.send(documents);
            });
        });
    })
    .delete(function(req, res) {
        var groupName = req.params.groupName;
        connection.Do(function(db) {
            db.collection("groups").deleteOne({ "groupName": groupName }, function(err, result) {
                assert.equal(null, err);
            });
            db.collection('forms').deleteMany({ 'groupName': groupName }, function(err, result) {
                assert.equal(null, err);
                res.send(groupName);
            });
        });
    });

groupsRouter.route('/getGroupForms/:groupName')
    .get(function(req, res) {
        var groupName = req.params.groupName;
        connection.Do(function(db) {
            db.collection("forms").find({ groupName: groupName }).sort({ order: 1 }).toArray(function(err, forms) {
                assert.equal(null, err);
                res.status(200).send(forms);
            });
        });
    });

groupsRouter.route('/getGroupElements/:groupName')
    .get(function(req, res) {
        var groupName = req.params.groupName;
        connection.Do(function(db) {
            db.collection("forms").find({ groupName: groupName }).sort({ order: 1 }).toArray(function(err, forms) {
                assert.equal(null, err);
                var elements = [];
                var elementNames = [];
                if (forms) {
                    for (var i = 0; i < forms.length; i++) {
                        var formElements = forms[i].elements;
                        for (var key in formElements) {
                            if (elementNames.indexOf(formElements[key].name) < 0 && (key.startsWith("text") || key.startsWith("dropdown") || key.startsWith("radio") || key.startsWith("checkbox"))) {
                                elementNames.push(formElements[key].name);
                                elements.push(formElements[key]);
                            }
                        }
                    }
                }
                console.log(elements);
                res.status(200).send(elements);
            });
        });
    });

module.exports = groupsRouter;
