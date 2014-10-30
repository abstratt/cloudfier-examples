
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
        return q().then(function () {
            car = Examples.car()
        });
    });
    test('startsAsAvailable', function(done) {
        var car;
        return q().then(function () {
            car = Examples.car()
        }).then(function () {
            assert.strictEqual(car.available, true, 'car.available === true')
        });
    });
    test('tooOld', function(done) {
        try {
            var car;
            return q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.year = 1900
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('tooNew', function(done) {
        try {
            var car;
            return q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.year = 2500
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooLow', function(done) {
        try {
            var car;
            return q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.price = 49
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooHigh', function(done) {
        try {
            var car;
            return q().then(function () {
                car = Examples.car()
            }).then(function () {
                car.price = 2000
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unavailableWhenRented', function(done) {
        var car, customer;
        return q().then(function () {
            console.log("car = Examples.car()");
            car = Examples.car();
            
            console.log("customer = Examples.customer()");
            customer = Examples.customer();
            
            console.log("assert.strictEqual(car.available, true, 'car.available === true')");
            assert.strictEqual(car.available, true, 'car.available === true');
            
            console.log("customer.rent(car)");
            customer.rent(car);
        }).then(function () {
            console.log("assert.strictEqual(!car.available, true, '!car.available === true')");
            assert.strictEqual(!car.available, true, '!car.available === true');
            
            console.log("customer.finishRental()");
            customer.finishRental();
        });
    });
    test('availableUponReturn', function(done) {
        var car, customer;
        return q().then(function () {
            console.log("car = Examples.car()");
            car = Examples.car();
            
            console.log("customer = Examples.customer()");
            customer = Examples.customer();
        }).then(function () {
            console.log("assert.strictEqual(car.available, true, 'car.available === true')");
            assert.strictEqual(car.available, true, 'car.available === true');
            
            console.log("customer.rent(car)");
            customer.rent(car);
        }).then(function () {
            console.log("assert.strictEqual(!car.available, true, '!car.available === true')");
            assert.strictEqual(!car.available, true, '!car.available === true');
            
            console.log("customer.finishRental()");
            customer.finishRental();
        }).then(function () {
            console.log("assert.strictEqual(car.available, true, 'car.available === true')");
            assert.strictEqual(car.available, true, 'car.available === true');
        });
    });
    test('unavailableWhenUnderRepair', function(done) {
        var car;
        return q().then(function () {
            console.log("car = Examples.car()");
            car = Examples.car();
            
            console.log("assert.strictEqual(!car.underRepair, true, '!car.underRepair === true')");
            assert.strictEqual(!car.underRepair, true, '!car.underRepair === true');
            
            console.log("car.startRepair()");
            car.startRepair();
        }).then(function () {
            console.log("assert.strictEqual(car.underRepair, true, 'car.underRepair === true')");
            assert.strictEqual(car.underRepair, true, 'car.underRepair === true');
        });
    });
});

