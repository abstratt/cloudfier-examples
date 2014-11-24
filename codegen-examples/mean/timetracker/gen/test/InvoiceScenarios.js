
var mongoose = require('mongoose');
var assert = require("assert");
var Q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - InvoiceScenarios', function() {
    this.timeout(10000);

    test('issueInvoice', function(done) {
        var behavior = function() {
            var invoice;
            var work;
            var client;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.client();
                    }).then(function(call_client) {
                        client = call_client;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return client.newTask(<Q>Some task<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return client.newTask("Some task");
                    }).then(function(call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(call_addWork) {
                        work = call_addWork;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return client.startInvoice();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return client.startInvoice();
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
                        console.log("assert.equal(<Q>Preparation<Q>, invoice['status']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.equal("Preparation", invoice['status']);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("invoice.issue();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        invoice.issue();
                    });
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.equal(<Q>Invoiced<Q>, invoice['status']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.equal("Invoiced", invoice['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('invoicePaid', function(done) {
        var behavior = function() {
            var invoice;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.client();
                    }).then(function(call_client) {
                        return call_client.startInvoice();
                    }).then(function(call_startInvoice) {
                        invoice = call_startInvoice;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return Client.findOne({ _id : invoice.client }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Client.findOne({ _id : invoice.client }).exec();
                    }).then(function(read_client) {
                        return read_client.newTask("Some task");
                    }).then(function(call_newTask) {
                        return call_newTask.addWork(1);
                    }).then(function(call_addWork) {
                        call_addWork.submit(invoice);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("invoice.issue();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        invoice.issue();
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("invoice.invoicePaid()<NL>return Q.when(null);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        invoice.invoicePaid()
                        return Q.when(null);
                    });
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.equal(<Q>Received<Q>, invoice['status']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.equal("Received", invoice['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        try {
            var behavior = function() {
                var task;
                var invoice;
                var work;
                var me = this;
                return Q.when(null).then(function() {
                    return Q.when(null).then(function() {
                        return Q.when(function() {
                            console.log("return Examples.task();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Examples.task();
                        }).then(function(call_task) {
                            task = call_task;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("return Client.findOne({ _id : task.client }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Client.findOne({ _id : task.client }).exec();
                        }).then(function(read_client) {
                            return read_client.startInvoice();
                        }).then(function(call_startInvoice) {
                            invoice = call_startInvoice;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("return task.addWork(1);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return task.addWork(1);
                        }).then(function(call_addWork) {
                            call_addWork.submit(invoice);
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("invoice.issue();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            invoice.issue();
                        });
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return task.addWork(2);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return task.addWork(2);
                    }).then(function(call_addWork) {
                        call_addWork.submit(invoice);
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        try {
            var behavior = function() {
                var me = this;
                return Q.when(function() {
                    console.log("return Examples.client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Examples.client();
                }).then(function(call_client) {
                    return call_client.startInvoice();
                }).then(function(call_startInvoice) {
                    call_startInvoice.issue();
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

