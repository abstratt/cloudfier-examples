
var assert = require("assert");
var Q = require("q");
var mongoose = require('../models/db.js');
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
                    return Examples.task();
                }).then(function(taskResult) {
                    return taskResult.addWork(1);
                }).then(function(addWorkResult) {
                    work = addWorkResult;
                });
            }).then(function() {
                return Q().then(function() {
                    assert.equal(new Date(), work.date);
                });
            });
        };
        behavior().then(done, done);
    });
    test('cannotAssignWorkToInvoiceFromAnotherClient', function(done) {
        var behavior = function() {
            var client1;
            var client2;
            var work;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Examples.client();
                }).then(function(clientResult) {
                    client1 = clientResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return Examples.client();
                }).then(function(clientResult) {
                    client2 = clientResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return client1.newTask("Some task");
                }).then(function(newTaskResult) {
                    return newTaskResult.addWork(1);
                }).then(function(addWorkResult) {
                    work = addWorkResult;
                });
            }).then(function() {
                return Q.all([
                    Q().then(function() {
                        return client2.startInvoice();
                    }),
                    Q().then(function() {
                        return work;
                    })
                ]).spread(function(startInvoiceResult, work) {
                    return work.submit(startInvoiceResult);
                });
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (WrongClient), none occurred"));
        }, function(error) {
            try {
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.submit);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
    test('cannotSubmitWorkToInvoiceAlreadyInvoiced', function(done) {
        var behavior = function() {
            var invoice;
            var work;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Examples.client();
                }).then(function(clientResult) {
                    return clientResult.newTask("Some task");
                }).then(function(newTaskResult) {
                    return newTaskResult.addWork(1);
                }).then(function(addWorkResult) {
                    work = addWorkResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return work.getClient();
                }).then(function(client) {
                    return client.startInvoice();
                }).then(function(startInvoiceResult) {
                    invoice = startInvoiceResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return work.submit(invoice);
                });
            }).then(function() {
                return Q().then(function() {
                    return work.submit(invoice);
                });
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (AlreadyInvoiced), none occurred"));
        }, function(error) {
            try {
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.submit);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
    test('unitsWorkedMustBePositive', function(done) {
        var behavior = function() {
            var me = this;
            return Q().then(function() {
                return Examples.task();
            }).then(function(taskResult) {
                return taskResult.addWork(-(1));
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (MustBePositive), none occurred"));
        }, function(error) {
            try {
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.units);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
    test('unitsWorkedMayNotBeZero', function(done) {
        var behavior = function() {
            var me = this;
            return Q().then(function() {
                return Examples.task();
            }).then(function(taskResult) {
                return taskResult.addWork(0);
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (MustBePositive), none occurred"));
        }, function(error) {
            try {
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.units);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
});

