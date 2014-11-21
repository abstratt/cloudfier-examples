
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - TaskScenarios', function() {
    this.timeout(10000);

    test('timeReported', function(done) {
        var behavior = function() {
            var task;
            return q(/*sequential*/).then(function() {
                return q(/*leaf*/).then(function() {
                    return Examples.task();
                }).then(function(/*singleChild*/call_task) {
                    task = call_task;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return task.addWork(4);
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return task.addWork(3);
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.equal(2, /*TBD*/count);
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.equal(7, task['unitsReported']);
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
            return q(/*sequential*/).then(function() {
                return q(/*leaf*/).then(function() {
                    return Examples.task();
                }).then(function(/*singleChild*/call_task) {
                    task = call_task;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return task.addWork(4);
                }).then(function(/*singleChild*/call_addWork) {
                    work1 = call_addWork;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return task.addWork(3);
                }).then(function(/*singleChild*/call_addWork) {
                    work2 = call_addWork;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return Client.find({ _id : task.client }).exec();
                }).then(function(/*singleChild*/read_client) {
                    return read_client.startInvoice();
                }).then(function(/*singleChild*/call_startInvoice) {
                    invoice = call_startInvoice;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    work1.submit(invoice);
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return task.getToInvoice();
                }).then(function(/*singleChild*/read_toInvoice) {
                    assert.equal(1, /*TBD*/count);
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return task['unitsToInvoice'];
                }).then(function(/*singleChild*/read_unitsToInvoice) {
                    assert.equal(3, read_unitsToInvoice);
                });
            });
        };
        behavior().then(done, done);
    });
});

