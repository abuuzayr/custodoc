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
		console.log(result)//TOFIX
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

// get the keys a.k.a field names from the forms database
.post(function(req, res, next) {
    connection.Do(function(db) {
        var groupName = req.body.groupName;
        console.log(groupName);
        db.collection("forms").find({ groupName: groupName })
            .toArray()
            .then(function(forms) {
                if (docs.length === 0 || !forms)
                    throw new Error('No documents found!');
                else {
                    console.log('wat is forms: ' + forms.length);
                    var key;
                    var arrayOfKeys = [];
                    for (var i = 0; i < forms.length; i++) {
                        var data = forms[i];
                        var elements = data.elements;
                        for (key in elements) {
                            var element = elements[key];
                            if (element.name.startsWith('text_')) {
                                var index = element.name.indexOf('_');
                                var fieldName = element.name.substring(index + 1, element.name.length);
                                var noDuplicate = true;
                                // check for duplication here
                                for (var j = 0; j < arrayOfKeys.length; j++) {
                                    if (fieldName !== arrayOfKeys[j]) {
                                        continue;
                                    } else {
                                        noDuplicate = false;
                                        break;
                                    }
                                }

                                if (noDuplicate) {
                                    arrayOfKeys.push(fieldName);
                                }
                            }
                        }
                    }
                    console.log(arrayOfKeys);
                    return arrayOfKeys;
                }
            })
            .then(function(result) {
                console.log('did i come here ' + result);
                return res.status(200).send(result);
            })
            .catch(function(err) {
                return res.status(400).send('' + err);
            });
    });
});

module.exports = entryRoutes;
