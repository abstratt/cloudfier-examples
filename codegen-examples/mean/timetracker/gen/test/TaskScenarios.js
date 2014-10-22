
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
        var task;
        q().then(function () {
            task = Examples.task()
        }).then(function () {
            task.addWork(4)
        }).then(function () {
            task.addWork(3)
        }).then(function () {
            assert.equal(2, count, '2 == count')
        }).then(function () {
            assert.equal(7, task.unitsReported, '7 == task.unitsReported')
        }).then(done, done);
    });
    test('timeToInvoice', function(done) {
        var task, invoice, work1, work2;
        q().then(function () {
            task = Examples.task()
        }).then(function () {
            work1 = task.addWork(4)
        }).then(function () {
            work2 = task.addWork(3)
        }).then(function () {
            invoice = task.client.startInvoice()
        }).then(function () {
            work1.submit(invoice)
        }).then(function () {
            assert.equal(1, count, '1 == count')
        }).then(function () {
            assert.equal(3, task.unitsToInvoice, '3 == task.unitsToInvoice')
        }).then(done, done);
    });
});

