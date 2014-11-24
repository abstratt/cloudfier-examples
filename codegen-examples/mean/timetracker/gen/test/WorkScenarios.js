
var mongoose = require('mongoose');
var assert = require("assert");
var Q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - WorkScenarios', function() {
    this.timeout(10000);

    test('workDateDefaultsToToday', function(done) {
        var behavior = function() {
            var work;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(function() {
                    console.log("return Examples.task();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Examples.task();
                }).then(function(call_task) {
                    return call_task.addWork(1);
                }).then(function(call_addWork) {
                    work = call_addWork;
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.equal(new Date(), work['date']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                var me = this;
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.client();
                    }).then(function(call_client) {
                        client1 = call_client;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.client();
                    }).then(function(call_client) {
                        client2 = call_client;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return client1.newTask(<Q>Some task<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return client1.newTask("Some task");
                    }).then(function(call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(call_addWork) {
                        work = call_addWork;
                    });
                }).then(function() {
                    return Q.all([
                        Q.when(function() {
                            console.log("return client2.startInvoice();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return client2.startInvoice();
                        }),
                        Q.when(function() {
                            console.log("return work;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                var me = this;
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.client();
                    }).then(function(call_client) {
                        return call_client.newTask("Some task");
                    }).then(function(call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(call_addWork) {
                        work = call_addWork;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return work.getClient();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return work.getClient();
                    }).then(function(read_client) {
                        return read_client.startInvoice();
                    }).then(function(call_startInvoice) {
                        invoice = call_startInvoice;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("work.submit(invoice);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        work.submit(invoice);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("work.submit(invoice);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                var me = this;
                return Q.when(function() {
                    console.log("return Examples.task();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Examples.task();
                }).then(function(call_task) {
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
                var me = this;
                return Q.when(function() {
                    console.log("return Examples.task();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Examples.task();
                }).then(function(call_task) {
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

