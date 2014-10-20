
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

suite('Time Tracker functional tests - TaskScenarios', function() {
    this.timeout(10000);

    
    test('timeReported', function(done) {
        // a block
        var task = require('./Examples.js').task();
        task.addWork(4);
        task.addWork(3);
        assert.equal(2, count), '2 == count' ;
        assert.equal(7, task.unitsReported), '7 == task.unitsReported' ;
        done();
    });
    test('timeToInvoice', function(done) {
        // a block
        var task = require('./Examples.js').task();
        var work1 = task.addWork(4);
        var work2 = task.addWork(3);
        var invoice = task.client.startInvoice();
        work1.submit(invoice);
        assert.equal(1, count), '1 == count' ;
        assert.equal(3, task.unitsToInvoice), '3 == task.unitsToInvoice' ;
        done();
    });
});

