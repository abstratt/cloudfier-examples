
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
        var invoice, work, client;
        q().then(function () {
            client = Examples.client();
            work = client.newTask("Some task").addWork(1);
            invoice = client.startInvoice();
            work.submit(invoice);
            assert.equal("Preparation", invoice.status, '"Preparation" == invoice.status');
            invoice.issue();
        }).then(function () {
            assert.equal("Invoiced", invoice.status, '"Invoiced" == invoice.status');
        }).then(done, done);
    });
    test('invoicePaid', function(done) {
        var invoice;
        q().then(function () {
            invoice = Examples.client().startInvoice();
            invoice.client.newTask("Some task").addWork(1).submit(invoice);
            invoice.issue();
            /*invoice.invoicePaid()*/;
        }).then(function () {
            assert.equal("Received", invoice.status, '"Received" == invoice.status');
        }).then(done, done);
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        try {
            var task, invoice, work;
            q().then(function () {
                task = Examples.task();
                invoice = task.client.startInvoice();
                task.addWork(1).submit(invoice);
                invoice.issue();
            }).then(function () {
                task.addWork(2).submit(invoice);
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        try {
            q().then(function () {
                Examples.client().startInvoice().issue()
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

