
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - RentalScenarios', function() {
    this.timeout(10000);

    test('startsAsInProgress', function(done) {
        var car, customer;
        q().then(function () {
            car = Examples.car();
            customer = Examples.customer();
            assert.ok(customer.getCurrentRental() == null, 'customer.getCurrentRental() == null');
            customer.rent(car);
        }).then(function () {
            assert.ok(customer.getCurrentRental() != null, 'customer.getCurrentRental() != null');
            assert.strictEqual(customer.getCurrentRental().inProgress, true, 'customer.getCurrentRental().inProgress === true');
        }).then(done, done);
    });
    test('finishedUponReturn', function(done) {
        var car, customer, rental;
        q().then(function () {
            car = Examples.car();
            customer = Examples.customer();
            customer.rent(car);
            rental = customer.getCurrentRental();
        }).then(function () {
            assert.strictEqual(rental.inProgress, true, 'rental.inProgress === true');
            customer.finishRental();
        }).then(function () {
            assert.strictEqual(!rental.inProgress, true, '!rental.inProgress === true');
        }).then(done, done);
    });
    test('oneCarPerCustomer', function(done) {
        try {
            var car1, car2, customer;
            q().then(function () {
                car1 = Examples.car();
                customer = Examples.customer();
                customer.rent(car1);
            }).then(function () {
                car2 = Examples.car();
                customer.rent(car2);
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('carUnavailable', function(done) {
        try {
            var car, customer1, customer2;
            q().then(function () {
                car = Examples.car();
                customer1 = Examples.customer();
                customer1.rent(car);
            }).then(function () {
                assert.strictEqual(car.rented, true, 'car.rented === true');
                customer2 = Examples.customer();
                customer2.rent(car);
            }).then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

