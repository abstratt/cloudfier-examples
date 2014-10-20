
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

suite('Time Tracker functional tests - WorkScenarios', function() {
    this.timeout(10000);

    
    test('workDateDefaultsToToday', function(done) {
        // a block
        var work = require('./Examples.js').task().addWork(1);
        assert.equal(new Date(), work.date), 'new Date() == work.date' ;
        done();
    });
    test('cannotAssignWorkToInvoiceFromAnotherClient', function(done) {
        // a block
        var client1 = require('./Examples.js').client();
        var client2 = require('./Examples.js').client();
        var work = client1.newTask("Some task").addWork(1);
        work.submit(client2.startInvoice());
        done();
    });
    test('cannotSubmitWorkToInvoiceAlreadyInvoiced', function(done) {
        // a block
        var work = require('./Examples.js').client().newTask("Some task").addWork(1);
        var invoice = work.getClient().startInvoice();
        work.submit(invoice);
        work.submit(invoice);
        done();
    });
    test('unitsWorkedMustBePositive', function(done) {
        // a block
        require('./Examples.js').task().addWork(-(1));
        done();
    });
    test('unitsWorkedMayNotBeZero', function(done) {
        // a block
        require('./Examples.js').task().addWork(0);
        done();
    });
});

