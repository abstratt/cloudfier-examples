
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - InvoiceScenarios', function() {
    this.timeout(100000);

    test('issueInvoice', function(done) {
        var behavior = function() {
            var invoice;
            var work;
            var client;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.client();");
                        return Examples.client();
                    }).then(function(client) {
                        console.log(client);
                        console.log("client = client;\n");
                        client = client;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return client.newTask(\"Some task\");");
                        return client.newTask("Some task");
                    }).then(function(newTask) {
                        console.log(newTask);
                        console.log("return newTask.addWork(1);");
                        return newTask.addWork(1);
                    }).then(function(addWork) {
                        console.log(addWork);
                        console.log("work = addWork;\n");
                        work = addWork;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return client.startInvoice();");
                        return client.startInvoice();
                    }).then(function(startInvoice) {
                        console.log(startInvoice);
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
                        console.log("assert.equal(\"Preparation\", invoice['status']);\n");
                        assert.equal("Preparation", invoice['status']);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return invoice.issue();");
                        return invoice.issue();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(\"Invoiced\", invoice['status']);\n");
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
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.client();");
                        return Examples.client();
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
                        console.log("return Q.npost(Client, 'findOne', [ ({ _id : invoice.client }) ]);");
                        return Q.npost(Client, 'findOne', [ ({ _id : invoice.client }) ]);
                    }).then(function(client) {
                        console.log(client);
                        console.log("return client.newTask(\"Some task\");");
                        return client.newTask("Some task");
                    }).then(function(newTask) {
                        console.log(newTask);
                        console.log("return newTask.addWork(1);");
                        return newTask.addWork(1);
                    }).then(function(addWork) {
                        console.log(addWork);
                        console.log("return addWork.submit(invoice);");
                        return addWork.submit(invoice);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return invoice.issue();");
                        return invoice.issue();
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("invoice.invoicePaid();\n");
                        invoice.invoicePaid();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(\"Received\", invoice['status']);\n");
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
                return Q().then(function() {
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
                            console.log("return task.addWork(1);");
                            return task.addWork(1);
                        }).then(function(addWork) {
                            console.log(addWork);
                            console.log("return addWork.submit(invoice);");
                            return addWork.submit(invoice);
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("return invoice.issue();");
                            return invoice.issue();
                        });
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return task.addWork(2);");
                        return task.addWork(2);
                    }).then(function(addWork) {
                        console.log(addWork);
                        console.log("return addWork.submit(invoice);");
                        return addWork.submit(invoice);
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
                return Q().then(function() {
                    console.log("return Examples.client();");
                    return Examples.client();
                }).then(function(client) {
                    console.log(client);
                    console.log("return client.startInvoice();");
                    return client.startInvoice();
                }).then(function(startInvoice) {
                    console.log(startInvoice);
                    console.log("return startInvoice.issue();");
                    return startInvoice.issue();
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

