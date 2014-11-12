
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = require('./Examples.js');


suite('Time Tracker functional tests - TaskScenarios', function() {
    this.timeout(10000);

    test('timeReported', function(done) {
        var behavior = function() {
            return q().all([q().then(function() {
                return task.addWork(4);
            }), q().then(function() {
                return task.addWork(3);
            })]).spread(function(addWork, addWork) {
                task = Examples.task();
                addWork;
                addWork;
                assert.equal(2, count);
                assert.equal(7, task['unitsReported']);
            });
        };
        behavior().then(done, done);
    });
    test('timeToInvoice', function(done) {
        var behavior = function() {
            return q().all([q().then(function() {
                return task.addWork(4);
            }), q().then(function() {
                return task.addWork(3);
            }), q().then(function() {
                return Client.find({ _id : task.client }).exec();
            }).then(function(client) {
                return client.startInvoice();
            }), q().then(function() {
                work1.submit(invoice)
            }), q().then(function() {
                return task.getToInvoice();
            }), q().then(function() {
                return task['unitsToInvoice'];
            })]).spread(function(addWork, addWork, startInvoice, submit, toInvoice, unitsToInvoice) {
                task = Examples.task();
                work1 = addWork;
                work2 = addWork;
                invoice = startInvoice;
                submit;
                assert.equal(1, count);
                assert.equal(3, unitsToInvoice);
            });
        };
        behavior().then(done, done);
    });
});

