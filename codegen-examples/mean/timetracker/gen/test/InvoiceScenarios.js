
var mongoose = require('mongoose');

var assert = require("assert");

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - InvoiceScenarios', function() {
    this.timeout(10000);

    test('issueInvoice', function(done) {
        var client = Examples.client();
        var work = client.newTask("Some task").addWork(1);
        var invoice = client.startInvoice();
        work.submit(invoice);
        assert.equal("Preparation", invoice.status, '"Preparation" == invoice.status');
        invoice.issue();
        assert.equal("Invoiced", invoice.status, '"Invoiced" == invoice.status');
        done();
    });
    test('invoicePaid', function(done) {
        var invoice = Examples.client().startInvoice();
        invoice.client.newTask("Some task").addWork(1).submit(invoice);
        invoice.issue();
        /*invoice.invoicePaid()*/;
        assert.equal("Received", invoice.status, '"Received" == invoice.status');
        done();
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        try {
            var task = Examples.task();
            var invoice = task.client.startInvoice();
            task.addWork(1).submit(invoice);
            invoice.issue();
            task.addWork(2).submit(invoice);
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        try {
            Examples.client().startInvoice().issue();
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

