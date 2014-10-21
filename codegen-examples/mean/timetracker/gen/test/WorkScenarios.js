
var mongoose = require('mongoose');

var assert = require("assert");

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - WorkScenarios', function() {
    this.timeout(10000);

    test('workDateDefaultsToToday', function(done) {
        var work = Examples.task().addWork(1);
        assert.equal(new Date(), work.date, 'new Date() == work.date');
        done();
    });
    test('cannotAssignWorkToInvoiceFromAnotherClient', function(done) {
        try {
        var client1 = Examples.client();
        var client2 = Examples.client();
        var work = client1.newTask("Some task").addWork(1);
        work.submit(client2.startInvoice());
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotSubmitWorkToInvoiceAlreadyInvoiced', function(done) {
        try {
        var work = Examples.client().newTask("Some task").addWork(1);
        var invoice = work.getClient().startInvoice();
        work.submit(invoice);
        work.submit(invoice);
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMustBePositive', function(done) {
        try {
        Examples.task().addWork(-1);
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMayNotBeZero', function(done) {
        try {
        Examples.task().addWork(0);
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

