var express = require('express');
var bodyParser = require('body-parser');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var http403 = require('../../utils/403')();
var connection = require('../../utils/connection.js')();
var sendError = require('../../utils/errorHandler.js');

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
    .post(function(req, res, next) {
        var formData = req.body.formData;
        console.log(formData);
        delete formData._id;
        connection.Do(function(db) {
            db.collection("forms").find({ formName: formData.formName, groupName: formData.groupName }).limit(1)
                .next(function(err, item) {
                    if (err)
                        return sendError(req, res, 400, err.message, 'Not created');
                    if (item) {
                        return sendError(req, res, 400, 'Form already exists', 'Form already exists');
                    } else {
                        formData.isImportant = formData.isImportant ? formData.isImportant : 'Normal';
                        formData.creationDate = new Date();
                        formData.creator = req.decoded.username;
                        formData.lastModified = new Date();
                        formData.lastModifiedBy = req.decoded.username;
                        formData.numberOfPages = formData.numberOfPages ? formData.numberOfPages : 1;

                        db.collection("forms").insert(formData).then(function(result) {
                            return res.status(200).send({ formName: formData.formName, groupName: formData.groupName, _id: result.ops[0]._id });
                        }).catch(function(err) {
                            return sendError(req, res, 400, err.message, 'Not created');
                        });
                    }
                });
        });
    });
formsRouter.route('/:formId')
    .get(function(req, res, next) {
        connection.Do(function(db) {
            db.collection("forms").find({
                    _id: ObjectID(req.params.formId)
                })
                .limit(1)
                .next(function(err, item) {
                    if (err)
                        return sendError(req, res, 400, err.message, 'Failed to retrieve form');
                    else if (item) {
                        res.status(200).send(item);
                    } else {
                        return sendError(req, res, 400, 'Form not found', 'Failed to retrieve form');
                    }
                });
        });
    })
    .put(function(req, res, next) {
        connection.Do(function(db) {
            delete req.body.formData._id;
            db.collection("forms").findOneAndUpdate({
                    _id: ObjectID(req.params.formId)
                }, { $set: req.body.formData })
                .then(function(result) {
                    if (!result || result.matchedCount === 0)
                        return sendError(req, res, 400, 'Form not found', 'Not Updated');
                    return res.status(200).send(result);
                })
                .catch(function(err) {
                    return sendError(req, res, 400, err.message, 'Not updated');
                });
        });
    })
    .delete(function(req, res, next) {
        connection.Do(function(db) {
            db.collection("forms").deleteOne({ _id: ObjectID(req.params.formId) }).then(function(result) {
                    if (!result || result.matchedCount === 0)
                        return sendError(req, res, 400, 'Form not found', 'Not deleted');
                    return res.status(200).send('ok');
                })
                .catch(function(err) {
                    return sendError(req, res, 400, err.message, 'Not deleted');
                });
        });
    });

module.exports = formsRouter;
