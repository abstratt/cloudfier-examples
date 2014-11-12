
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - CarScenarios', function() {
    this.timeout(10000);

    test('startsAsValid', function(done) {
        car = Examples.car();
    });
    test('startsAsAvailable', function(done) {
        car = Examples.car();
        assert.strictEqual(car['available'], true);
    });
    test('tooOld', function(done) {
        try {
            car = Examples.car();
            car['year'] = 1900;
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('tooNew', function(done) {
        try {
            car = Examples.car();
            car['year'] = 2500;
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooLow', function(done) {
        try {
            car = Examples.car();
            car['price'] = 49;
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooHigh', function(done) {
        try {
            car = Examples.car();
            car['price'] = 2000;
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unavailableWhenRented', function(done) {
        return q().all([q().then(function() {
            customer.rent(car)
        }), q().then(function() {
            customer.finishRental()
        })]).spread(function(rent, finishRental) {
            car = Examples.car();
            customer = Examples.customer();
            assert.strictEqual(car['available'], true);
            rent;
            assert.strictEqual(!car['available'], true);
            finishRental;
        });
    });
    test('availableUponReturn', function(done) {
        return q().all([q().then(function() {
            customer.rent(car)
        }), q().then(function() {
            customer.finishRental()
        })]).spread(function(rent, finishRental) {
            car = Examples.car();
            customer = Examples.customer();
            assert.strictEqual(car['available'], true);
            rent;
            assert.strictEqual(!car['available'], true);
            finishRental;
            assert.strictEqual(car['available'], true);
        });
    });
    test('unavailableWhenUnderRepair', function(done) {
        return q().then(function() {
            car.startRepair()
        }).then(function(startRepair) {
            car = Examples.car();
            assert.strictEqual(!car['underRepair'], true);
            startRepair;
            assert.strictEqual(car['underRepair'], true);
        });
    });
});

