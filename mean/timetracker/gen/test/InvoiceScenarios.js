
var assert = require("assert");
var Q = require("q");
var mongoose = require('../models/db.js');
require('../models/index.js');        


var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');
var Work = require('../models/Work.js');

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
                        return Examples.client();
                    }).then(function(clientResult) {
                        client = clientResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return client.newTask("Some task");
                    }).then(function(newTaskResult) {
                        return newTaskResult.addWork(1);
                    }).then(function(addWorkResult) {
                        work = addWorkResult;
                    });
                }).then(function() {
                    return Q().then(function() {
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
                        assert.equal("Preparation", invoice.status);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return invoice.issue();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Invoice.js'), 'findOne', [ ({ _id : invoice._id }) ]);
                }).then(function(invoice) {
                    assert.equal("Invoiced", invoice.status);
                });
            });
        };
        behavior().then(done, done);
    });
    test('totalUnits', function(done) {
        var behavior = function() {
            var invoice;
            var task1;
            var task2;
            var client;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Examples.client();
                    }).then(function(clientResult) {
                        client = clientResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return client.startInvoice();
                    }).then(function(startInvoiceResult) {
                        invoice = startInvoiceResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return client.newTask("Task 1");
                    }).then(function(newTaskResult) {
                        task1 = newTaskResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return client.newTask("Task 2");
                    }).then(function(newTaskResult) {
                        task2 = newTaskResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return task1.addWork(1);
                    }).then(function(addWorkResult) {
                        return addWorkResult.submit(invoice);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return task1.addWork(3);
                    }).then(function(addWorkResult) {
                        return addWorkResult.submit(invoice);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return task2.addWork(7);
                    }).then(function(addWorkResult) {
                        return addWorkResult.submit(invoice);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Invoice.js'), 'findOne', [ ({ _id : invoice._id }) ]);
                }).then(function(invoice) {
                    return invoice.getTotalUnits();
                }).then(function(totalUnits) {
                    assert.equal(11, totalUnits);
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
                        return Examples.client();
                    }).then(function(clientResult) {
                        return clientResult.startInvoice();
                    }).then(function(startInvoiceResult) {
                        invoice = startInvoiceResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Client.js'), 'findOne', [ ({ _id : invoice.client }) ]);
                    }).then(function(client) {
                        return client.newTask("Some task");
                    }).then(function(newTaskResult) {
                        return newTaskResult.addWork(1);
                    }).then(function(addWorkResult) {
                        return addWorkResult.submit(invoice);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return invoice.issue();
                    });
                }).then(function() {
                    return Q().then(function() {
                        return invoice.invoicePaid();;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Invoice.js'), 'findOne', [ ({ _id : invoice._id }) ]);
                }).then(function(invoice) {
                    assert.equal("Received", invoice.status);
                });
            });
        };
        behavior().then(done, done);
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        var behavior = function() {
            var task;
            var invoice;
            var work;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Examples.task();
                    }).then(function(taskResult) {
                        task = taskResult;
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
                        return task.addWork(1);
                    }).then(function(addWorkResult) {
                        return addWorkResult.submit(invoice);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return invoice.issue();
                    });
                });
            }).then(function() {
                return Q.all([
                    Q().then(function() {
                        return Q.npost(require('../models/Invoice.js'), 'findOne', [ ({ _id : invoice._id }) ]);
                    }),
                    Q().then(function() {
                        return Q.npost(require('../models/Task.js'), 'findOne', [ ({ _id : task._id }) ]);
                    }).then(function(task) {
                        return task.addWork(2);
                    })
                ]).spread(function(invoice, addWorkResult) {
                    return addWorkResult.submit(invoice);
                });
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (InvoiceNotOpen), none occurred"));
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
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        var behavior = function() {
            var me = this;
            return Q().then(function() {
                return Examples.client();
            }).then(function(clientResult) {
                return clientResult.startInvoice();
            }).then(function(startInvoiceResult) {
                return startInvoiceResult.issue();
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (MustHaveWork), none occurred"));
        }, function(error) {
            try {
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.issue);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
});

