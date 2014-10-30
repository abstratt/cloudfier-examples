
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
        return q().then(function () {
            console.log("client = Examples.client()");
            client = Examples.client();
            
            console.log("work = client.newTask('Some task').addWork(1)");
            work = client.newTask("Some task").addWork(1);
            
            console.log("invoice = client.startInvoice()");
            invoice = client.startInvoice();
            
            console.log("work.submit(invoice)");
            work.submit(invoice);
            
            console.log("assert.equal('Preparation', invoice.status, ''Preparation' == invoice.status')");
            assert.equal("Preparation", invoice.status, '"Preparation" == invoice.status');
            
            console.log("invoice.issue()");
            invoice.issue();
        }).then(function () {
            console.log("assert.equal('Invoiced', invoice.status, ''Invoiced' == invoice.status')");
            assert.equal("Invoiced", invoice.status, '"Invoiced" == invoice.status');
        });
    });
    test('invoicePaid', function(done) {
        var invoice;
        return q().then(function () {
            console.log("invoice = Examples.client().startInvoice()");
            invoice = Examples.client().startInvoice();
            
            console.log("invoice.client.newTask('Some task').addWork(1).submit(invoice)");
            invoice.client.newTask("Some task").addWork(1).submit(invoice);
            
            console.log("invoice.issue()");
            invoice.issue();
            
            console.log("/*invoice.invoicePaid()*/");
            /*invoice.invoicePaid()*/;
        }).then(function () {
            console.log("assert.equal('Received', invoice.status, ''Received' == invoice.status')");
            assert.equal("Received", invoice.status, '"Received" == invoice.status');
        });
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        try {
            var task, invoice, work;
            return q().then(function () {
                console.log("task = Examples.task()");
                task = Examples.task();
                
                console.log("invoice = task.client.startInvoice()");
                invoice = task.client.startInvoice();
                
                console.log("task.addWork(1).submit(invoice)");
                task.addWork(1).submit(invoice);
                
                console.log("invoice.issue()");
                invoice.issue();
            }).then(function () {
                console.log("task.addWork(2).submit(invoice)");
                task.addWork(2).submit(invoice);
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        try {
            return q().then(function () {
                Examples.client().startInvoice().issue()
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

