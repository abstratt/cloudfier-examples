
var mongoose = require('mongoose');

var assert = require("assert");

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - TaskScenarios', function() {
    this.timeout(10000);

    test('timeReported', function(done) {
        var task = Examples.task();
        task.addWork(4);
        task.addWork(3);
        assert.equal(2, count, '2 == count');
        assert.equal(7, task.unitsReported, '7 == task.unitsReported');
        done();
    });
    test('timeToInvoice', function(done) {
        var task = Examples.task();
        var work1 = task.addWork(4);
        var work2 = task.addWork(3);
        var invoice = task.client.startInvoice();
        work1.submit(invoice);
        assert.equal(1, count, '1 == count');
        assert.equal(3, task.unitsToInvoice, '3 == task.unitsToInvoice');
        done();
    });
});

