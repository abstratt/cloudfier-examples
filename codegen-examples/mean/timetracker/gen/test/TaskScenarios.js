
var assert = require("assert");
var Q = require("q");
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
                    console.log("return Examples.task();");
                    return Examples.task();
                }).then(function(task) {
                    console.log(task);
                    console.log("task = task;\n");
                    task = task;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return task.addWork(4);");
                    return task.addWork(4);
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return task.addWork(3);");
                    return task.addWork(3);
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(2, task['reported'].length);\n");
                    assert.equal(2, task['reported'].length);
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(7, task['unitsReported']);\n");
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
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    console.log("return Examples.task();");
                    return Examples.task();
                }).then(function(task) {
                    console.log(task);
                    console.log("task = task;\n");
                    task = task;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return task.addWork(4);");
                    return task.addWork(4);
                }).then(function(addWork) {
                    console.log(addWork);
                    console.log("work1 = addWork;\n");
                    work1 = addWork;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return task.addWork(3);");
                    return task.addWork(3);
                }).then(function(addWork) {
                    console.log(addWork);
                    console.log("work2 = addWork;\n");
                    work2 = addWork;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Client, 'findOne', [ ({ _id : task.client }) ]);");
                    return Q.npost(Client, 'findOne', [ ({ _id : task.client }) ]);
                }).then(function(client) {
                    console.log(client);
                    console.log("return client.startInvoice();");
                    return client.startInvoice();
                }).then(function(startInvoice) {
                    console.log(startInvoice);
                    console.log("invoice = startInvoice;\n");
                    invoice = startInvoice;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return work1.submit(invoice);");
                    return work1.submit(invoice);
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return task.getToInvoice();");
                    return task.getToInvoice();
                }).then(function(toInvoice) {
                    console.log(toInvoice);
                    console.log("assert.equal(1, toInvoice.length);\n");
                    assert.equal(1, toInvoice.length);
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return task['unitsToInvoice'];");
                    return task['unitsToInvoice'];
                }).then(function(unitsToInvoice) {
                    console.log(unitsToInvoice);
                    console.log("assert.equal(3, unitsToInvoice);\n");
                    assert.equal(3, unitsToInvoice);
                });
            });
        };
        behavior().then(done, done);
    });
});

