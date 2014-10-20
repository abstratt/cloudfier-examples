
var mongoose = require('mongoose');
var HttpClient = require("../http-client.js");
var helpers = require('../helpers.js');
var util = require('util');
var q = require('q');

var assert = require("assert");
var folder = process.env.KIRRA_FOLDER || 'cloudfier-examples';

var kirraBaseUrl = process.env.KIRRA_BASE_URL || "http://localhost:48084";
var kirraApiUrl = process.env.KIRRA_API_URL || (kirraBaseUrl);
var httpClient = new HttpClient(kirraApiUrl);
var Examples = require('./Examples.js');

suite('Time Tracker functional tests - InvoiceScenarios', function() {
    this.timeout(10000);

    
    test('issueInvoice', function(done) {
        // a block
        var client = require('./Examples.js').client();
        var work = client.newTask("Some task").addWork(1);
        var invoice = client.startInvoice();
        work.submit(invoice);
        assert.equal(null, invoice.status), 'null == invoice.status' ;
        invoice.issue();
        assert.equal(null, invoice.status), 'null == invoice.status' ;
        done();
    });
    test('invoicePaid', function(done) {
        // a block
        var invoice = require('./Examples.js').client().startInvoice();
        invoice.client.newTask("Some task").addWork(1).submit(invoice);
        invoice.issue();
        /*invoice.invoicePaid()*/;
        assert.equal(null, invoice.status), 'null == invoice.status' ;
        done();
    });
    test('cannotSubmitWorkIfInvoiceNotOpen', function(done) {
        // a block
        var task = require('./Examples.js').task();
        var invoice = task.client.startInvoice();
        task.addWork(1).submit(invoice);
        invoice.issue();
        task.addWork(2).submit(invoice);
        done();
    });
    test('cannotIssueInvoiceWithoutAnyWork', function(done) {
        // a block
        require('./Examples.js').client().startInvoice().issue();
        done();
    });
});
