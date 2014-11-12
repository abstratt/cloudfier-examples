
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
        return q().then(function() {
            return Examples.task().addWork(1);
        }).then(function(addWork) {
            work = addWork;
            assert.equal(new Date(), work['date']);
        });
    });
    test('cannotAssignWorkToInvoiceFromAnotherClient', function(done) {
        try {
            return q().all([q().then(function() {
                return client1.newTask("Some task");
            }).then(function(newTask) {
                return newTask.addWork(1);
            }), q().then(function() {
                return client2.startInvoice();
            }).then(function(startInvoice) {
                work.submit(startInvoice)
            })]).spread(function(addWork, submit) {
                client1 = Examples.client();
                client2 = Examples.client();
                work = addWork;
                submit;
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('cannotSubmitWorkToInvoiceAlreadyInvoiced', function(done) {
        try {
            return q().all([q().then(function() {
                return Examples.client().newTask("Some task");
            }).then(function(newTask) {
                return newTask.addWork(1);
            }), q().then(function() {
                return work.getClient();
            }).then(function(client) {
                return client.startInvoice();
            }), q().then(function() {
                work.submit(invoice)
            }), q().then(function() {
                work.submit(invoice)
            })]).spread(function(addWork, startInvoice, submit, submit) {
                work = addWork;
                invoice = startInvoice;
                submit;
                submit;
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMustBePositive', function(done) {
        try {
            return q().then(function() {
                return Examples.task().addWork(-1);
            }).then(function(addWork) {
                addWork;
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unitsWorkedMayNotBeZero', function(done) {
        try {
            return q().then(function() {
                return Examples.task().addWork(0);
            }).then(function(addWork) {
                addWork;
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

