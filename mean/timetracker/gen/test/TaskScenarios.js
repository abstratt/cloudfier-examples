
var assert = require("assert");
var Q = require("q");
var mongoose = require('../models/db.js');
require('../models/index.js');        


var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - TaskScenarios', function() {
    this.timeout(100000);

    test('timeReported', function(done) {
        var behavior = function() {
            var task;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Examples.task();
                }).then(function(taskResult) {
                    task = taskResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return task.addWork(4);
                });
            }).then(function() {
                return Q().then(function() {
                    return task.addWork(3);
                });
            }).then(function() {
                return Q().then(function() {
                    return task.reported.length;
                }).then(function(sizeResult) {
                    assert.equal(2, sizeResult);
                });
            }).then(function() {
                return Q().then(function() {
                    return task.getUnitsReported();
                }).then(function(unitsReported) {
                    assert.equal(7, unitsReported);
                });
            });
        };
        behavior().then(done, done);
    });
    test('timeToInvoice', function(done) {
        var behavior = function() {
            var task;
            var invoice;
            var work1;
            var work2;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Examples.task();
                }).then(function(taskResult) {
                    task = taskResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return task.addWork(4);
                }).then(function(addWorkResult) {
                    work1 = addWorkResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return task.addWork(3);
                }).then(function(addWorkResult) {
                    work2 = addWorkResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Client.js'), 'findOne', [ ({ _id : task.client }) ]);
                }).then(function(client) {
                    return client.startInvoice();
                }).then(function(startInvoiceResult) {
                    invoice = startInvoiceResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return work1.submit(invoice);
                });
            }).then(function() {
                return Q().then(function() {
                    return task.getToInvoice();
                }).then(function(toInvoice) {
                    return toInvoice.length;
                }).then(function(sizeResult) {
                    assert.equal(1, sizeResult);
                });
            }).then(function() {
                return Q().then(function() {
                    return task.getUnitsToInvoice();
                }).then(function(unitsToInvoice) {
                    assert.equal(3, unitsToInvoice);
                });
            });
        };
        behavior().then(done, done);
    });
});

