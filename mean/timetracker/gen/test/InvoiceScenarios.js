
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
                        return Examples.client();
                    }).then(function(client) {
                        client = client;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return client.newTask("Some task");
                    }).then(function(newTask) {
                        return newTask.addWork(1);
                    }).then(function(addWork) {
                        work = addWork;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return client.startInvoice();
                    }).then(function(startInvoice) {
                        invoice = startInvoice;
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
    test('invoicePaid', function(done) {
        var behavior = function() {
            var invoice;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Examples.client();
                    }).then(function(client) {
                        return client.startInvoice();
                    }).then(function(startInvoice) {
                        invoice = startInvoice;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Client.js'), 'findOne', [ ({ _id : invoice.client }) ]);
                    }).then(function(client) {
                        return client.newTask("Some task");
                    }).then(function(newTask) {
                        return newTask.addWork(1);
                    }).then(function(addWork) {
                        return addWork.submit(invoice);
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
                    }).then(function(task) {
                        task = task;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Client.js'), 'findOne', [ ({ _id : task.client }) ]);
                    }).then(function(client) {
                        return client.startInvoice();
                    }).then(function(startInvoice) {
                        invoice = startInvoice;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return task.addWork(1);
                    }).then(function(addWork) {
                        return addWork.submit(invoice);
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
                ]).spread(function(invoice, addWork) {
                    return addWork.submit(invoice);
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
            }).then(function(client) {
                return client.startInvoice();
            }).then(function(startInvoice) {
                return startInvoice.issue();
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

