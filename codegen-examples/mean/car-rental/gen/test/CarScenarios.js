
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
        var car;
        q().then(function () {
            car = Examples.car()
        }).then(done, done);
    });
    test('startsAsAvailable', function(done) {
        var car;
        q().then(function () {
            car = Examples.car()
        }).then(function () {
            assert.strictEqual(car.available, true, 'car.available === true')
        }).then(done, done);
    });
    test('tooOld', function(done) {
        try {
            var car;
            q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.year = 1900
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('tooNew', function(done) {
        try {
            var car;
            q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.year = 2500
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooLow', function(done) {
        try {
            var car;
            q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.price = 49
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooHigh', function(done) {
        try {
            var car;
            q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.price = 2000
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unavailableWhenRented', function(done) {
        var car, customer;
        q().then(function () {
            car = Examples.car();
            customer = Examples.customer();
            assert.strictEqual(car.available, true, 'car.available === true');
            customer.rent(car);
        }).then(function () {
            assert.strictEqual(!car.available, true, '!car.available === true');
            customer.finishRental();
        }).then(done, done);
    });
    test('availableUponReturn', function(done) {
        var car, customer;
        q().then(function () {
            car = Examples.car();
            customer = Examples.customer();
        }).then(function () {
            assert.strictEqual(car.available, true, 'car.available === true');
            customer.rent(car);
        }).then(function () {
            assert.strictEqual(!car.available, true, '!car.available === true');
            customer.finishRental();
        }).then(function () {
            assert.strictEqual(car.available, true, 'car.available === true');
        }).then(done, done);
    });
    test('unavailableWhenUnderRepair', function(done) {
        var car;
        q().then(function () {
            car = Examples.car();
            assert.strictEqual(!car.underRepair, true, '!car.underRepair === true');
            car.startRepair();
        }).then(function () {
            assert.strictEqual(car.underRepair, true, 'car.underRepair === true');
        }).then(done, done);
    });
});

