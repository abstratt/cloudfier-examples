
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - InvoiceScenarios', function() {
    this.timeout(10000);

    test('issueInvoice', function(done) {
        return q().all([q().then(function() {
            return client.newTask("Some task");
        }).then(function(newTask) {
            return newTask.addWork(1);
        }), q().then(function() {
            return client.startInvoice();
        }), q().then(function() {
            work.submit(invoice)
        }), q().then(function() {
            invoice.issue()
        })]).spread(function(addWork, startInvoice, submit, issue) {
            client = Examples.client();
            work = addWork;
            invoice = startInvoice;
            submit;
            assert.equal("Preparation", invoice['status']);
            issue;
            assert.equal("Invoiced", invoice['status']);
        });
    });
    test('invoicePaid', function(done) {
        return q().all([q().then(function() {
            return Examples.client().startInvoice();
        }), q().then(function() {
            return Client.find({ _id : invoice.client }).exec();
        }).then(function(client) {
            return client.newTask("Some task");
        }).then(function(newTask) {
            return newTask.addWork(1);
        }).then(function(addWork) {
            addWork.submit(invoice)
        }), q().then(function() {
            invoice.issue()
        })]).spread(function(startInvoice, submit, issue) {
            invoice = startInvoice;
            submit;
            issue;
            invoice.invoicePaid();
            assert.equal("Received", invoice['status']);
        });
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        try {
            return q().all([q().then(function() {
                return Client.find({ _id : task.client }).exec();
            }).then(function(client) {
                return client.startInvoice();
            }), q().then(function() {
                return task.addWork(1);
            }).then(function(addWork) {
                addWork.submit(invoice)
            }), q().then(function() {
                invoice.issue()
            }), q().then(function() {
                return task.addWork(2);
            }).then(function(addWork) {
                addWork.submit(invoice)
            })]).spread(function(startInvoice, submit, issue, submit) {
                task = Examples.task();
                invoice = startInvoice;
                submit;
                issue;
                submit;
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        try {
            return q().then(function() {
                return Examples.client().startInvoice();
            }).then(function(startInvoice) {
                startInvoice.issue()
            }).then(function(issue) {
                issue;
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

