
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - WorkScenarios', function() {
    this.timeout(100000);

    test('workDateDefaultsToToday', function(done) {
        var behavior = function() {
            var work;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    console.log("return Examples.task();");
                    return Examples.task();
                }).then(function(task) {
                    console.log("return task.addWork(1);");
                    return task.addWork(1);
                }).then(function(addWork) {
                    console.log("work = addWork;\n");
                    work = addWork;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(new Date(), work.date);\n");
                    assert.equal(new Date(), work.date);
                });
            });
        };
        behavior().then(done, done);
    });
    test('cannotAssignWorkToInvoiceFromAnotherClient', function(done) {
        try {
            var behavior = function() {
                var client1;
                var client2;
                var work;
                var me = this;
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.client();");
                        return Examples.client();
                    }).then(function(client) {
                        console.log("client1 = client;\n");
                        client1 = client;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Examples.client();");
                        return Examples.client();
                    }).then(function(client) {
                        console.log("client2 = client;\n");
                        client2 = client;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return client1.newTask(\"Some task\");");
                        return client1.newTask("Some task");
                    }).then(function(newTask) {
                        console.log("return newTask.addWork(1);");
                        return newTask.addWork(1);
                    }).then(function(addWork) {
                        console.log("work = addWork;\n");
                        work = addWork;
                    });
                }).then(function() {
                    return Q.all([
                        Q().then(function() {
                            console.log("return client2.startInvoice();");
                            return client2.startInvoice();
                        }),
                        Q().then(function() {
                            console.log("return work;");
                            return work;
                        })
                    ]).spread(function(startInvoice, Work) {
                        return Work.submit(startInvoice);
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotSubmitWorkToInvoiceAlreadyInvoiced', function(done) {
        try {
            var behavior = function() {
                var invoice;
                var work;
                var me = this;
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.client();");
                        return Examples.client();
                    }).then(function(client) {
                        console.log("return client.newTask(\"Some task\");");
                        return client.newTask("Some task");
                    }).then(function(newTask) {
                        console.log("return newTask.addWork(1);");
                        return newTask.addWork(1);
                    }).then(function(addWork) {
                        console.log("work = addWork;\n");
                        work = addWork;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return work.getClient();");
                        return work.getClient();
                    }).then(function(client) {
                        console.log("return client.startInvoice();");
                        return client.startInvoice();
                    }).then(function(startInvoice) {
                        console.log("invoice = startInvoice;\n");
                        invoice = startInvoice;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return work.submit(invoice);");
                        return work.submit(invoice);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return work.submit(invoice);");
                        return work.submit(invoice);
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMustBePositive', function(done) {
        try {
            var behavior = function() {
                var me = this;
                return Q().then(function() {
                    console.log("return Examples.task();");
                    return Examples.task();
                }).then(function(task) {
                    console.log("return task.addWork(-1);");
                    return task.addWork(-1);
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMayNotBeZero', function(done) {
        try {
            var behavior = function() {
                var me = this;
                return Q().then(function() {
                    console.log("return Examples.task();");
                    return Examples.task();
                }).then(function(task) {
                    console.log("return task.addWork(0);");
                    return task.addWork(0);
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

