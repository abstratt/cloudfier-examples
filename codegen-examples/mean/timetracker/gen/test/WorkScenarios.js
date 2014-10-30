
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - WorkScenarios', function() {
    this.timeout(10000);

    test('workDateDefaultsToToday', function(done) {
        var work;
        return q().then(function () {
            work = Examples.task().addWork(1)
        }).then(function () {
            assert.equal(new Date(), work.date, 'new Date() == work.date')
        });
    });
    test('cannotAssignWorkToInvoiceFromAnotherClient', function(done) {
        try {
            var client1, client2, work;
            return q().then(function () {
                client1 = Examples.client()
            }).then(function () {
                client2 = Examples.client()
            }).then(function () {
                work = client1.newTask("Some task").addWork(1)
            }).then(function () {
                work.submit(client2.startInvoice())
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotSubmitWorkToInvoiceAlreadyInvoiced', function(done) {
        try {
            var invoice, work;
            return q().then(function () {
                work = Examples.client().newTask("Some task").addWork(1)
            }).then(function () {
                invoice = work.getClient().startInvoice()
            }).then(function () {
                work.submit(invoice)
            }).then(function () {
                work.submit(invoice)
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMustBePositive', function(done) {
        try {
            return q().then(function () {
                Examples.task().addWork(-1)
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMayNotBeZero', function(done) {
        try {
            return q().then(function () {
                Examples.task().addWork(0)
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

