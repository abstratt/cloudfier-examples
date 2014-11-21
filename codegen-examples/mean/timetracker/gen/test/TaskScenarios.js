
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
            return q().then(function() {
                return q().then(function() {
                    return Examples.task();
                }).then(function(call_task) {
                    task = call_task;
                });
            }).then(function() {
                return q().then(function() {
                    return task.addWork(4);
                });
            }).then(function() {
                return q().then(function() {
                    return task.addWork(3);
                });
            }).then(function() {
                return q().then(function() {
                    assert.equal(2, /*TBD*/count);
                });
            }).then(function() {
                return q().then(function() {
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
            return q().then(function() {
                return q().then(function() {
                    return Examples.task();
                }).then(function(call_task) {
                    task = call_task;
                });
            }).then(function() {
                return q().then(function() {
                    return task.addWork(4);
                }).then(function(call_addWork) {
                    work1 = call_addWork;
                });
            }).then(function() {
                return q().then(function() {
                    return task.addWork(3);
                }).then(function(call_addWork) {
                    work2 = call_addWork;
                });
            }).then(function() {
                return q().then(function() {
                    return Client.find({ _id : task.client }).exec();
                }).then(function(read_client) {
                    return read_client.startInvoice();
                }).then(function(call_startInvoice) {
                    invoice = call_startInvoice;
                });
            }).then(function() {
                return q().then(function() {
                    work1.submit(invoice);
                });
            }).then(function() {
                return q().then(function() {
                    return task.getToInvoice();
                }).then(function(read_toInvoice) {
                    assert.equal(1, /*TBD*/count);
                });
            }).then(function() {
                return q().then(function() {
                    return task['unitsToInvoice'];
                }).then(function(read_unitsToInvoice) {
                    assert.equal(3, read_unitsToInvoice);
                });
            });
        };
        behavior().then(done, done);
    });
});

