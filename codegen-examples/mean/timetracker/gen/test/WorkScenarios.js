
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - WorkScenarios', function() {
    this.timeout(10000);

    test('workDateDefaultsToToday', function(done) {
        var behavior = function() {
            var work;
            return q(/*sequential*/).then(function() {
                return q(/*leaf*/).then(function() {
                    return Examples.task();
                }).then(function(/*singleChild*/call_task) {
                    return call_task.addWork(1);
                }).then(function(/*singleChild*/call_addWork) {
                    work = call_addWork;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.equal(new Date(), work['date']);
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
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.client();
                    }).then(function(/*singleChild*/call_client) {
                        client1 = call_client;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.client();
                    }).then(function(/*singleChild*/call_client) {
                        client2 = call_client;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return client1.newTask("Some task");
                    }).then(function(/*singleChild*/call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(/*singleChild*/call_addWork) {
                        work = call_addWork;
                    });
                }).then(function() {
                    return q(/*parallel*/).all([
                        q(/*leaf*/).then(function() {
                            return client2.startInvoice();
                        }), q(/*leaf*/).then(function() {
                            return work;
                        })
                    ]).spread(function(call_startInvoice, read_Work) {
                        read_Work.submit(call_startInvoice);
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
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.client();
                    }).then(function(/*singleChild*/call_client) {
                        return call_client.newTask("Some task");
                    }).then(function(/*singleChild*/call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(/*singleChild*/call_addWork) {
                        work = call_addWork;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return work.getClient();
                    }).then(function(/*singleChild*/read_client) {
                        return read_client.startInvoice();
                    }).then(function(/*singleChild*/call_startInvoice) {
                        invoice = call_startInvoice;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        work.submit(invoice);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        work.submit(invoice);
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
                return q(/*leaf*/).then(function() {
                    return Examples.task();
                }).then(function(/*singleChild*/call_task) {
                    return call_task.addWork(-1);
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
                return q(/*leaf*/).then(function() {
                    return Examples.task();
                }).then(function(/*singleChild*/call_task) {
                    return call_task.addWork(0);
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

