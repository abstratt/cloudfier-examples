
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
        var behavior = function() {
            return q().all([q().then(function() {
                return customer.getCurrentRental();
            }), q().then(function() {
                customer.rent(car)
            }), q().then(function() {
                return customer.getCurrentRental();
            }), q().then(function() {
                return customer.getCurrentRental();
            })]).spread(function(currentRental, rent, currentRental, currentRental) {
                car = Examples.car();
                customer = Examples.customer();
                assert.ok(currentRental == null);
                rent;
                assert.ok(currentRental != null);
                assert.strictEqual(currentRental['inProgress'], true);
            });
        };
        behavior().then(done, done);
    });
    test('finishedUponReturn', function(done) {
        var behavior = function() {
            return q().all([q().then(function() {
                customer.rent(car)
            }), q().then(function() {
                return customer.getCurrentRental();
            }), q().then(function() {
                customer.finishRental()
            })]).spread(function(rent, currentRental, finishRental) {
                car = Examples.car();
                customer = Examples.customer();
                rent;
                rental = currentRental;
                assert.strictEqual(rental['inProgress'], true);
                finishRental;
                assert.strictEqual(!rental['inProgress'], true);
            });
        };
        behavior().then(done, done);
    });
    test('oneCarPerCustomer', function(done) {
        try {
            var behavior = function() {
                return q().all([q().then(function() {
                    customer.rent(car1)
                }), q().then(function() {
                    customer.rent(car2)
                })]).spread(function(rent, rent) {
                    car1 = Examples.car();
                    customer = Examples.customer();
                    rent;
                    car2 = Examples.car();
                    rent;
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('carUnavailable', function(done) {
        try {
            var behavior = function() {
                return q().all([q().then(function() {
                    customer1.rent(car)
                }), q().then(function() {
                    customer2.rent(car)
                })]).spread(function(rent, rent) {
                    car = Examples.car();
                    customer1 = Examples.customer();
                    rent;
                    assert.strictEqual(car['rented'], true);
                    customer2 = Examples.customer();
                    rent;
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

