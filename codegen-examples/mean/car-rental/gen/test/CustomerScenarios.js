
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - CustomerScenarios', function() {
    this.timeout(10000);

    test('rentalHistory', function(done) {
        var behavior = function() {
            return q().all([q().then(function() {
                customer.rent(car)
            }), q().then(function() {
                return Rental.findOne({ _id : customer.rentals }).exec();
            }), q().then(function() {
                customer.finishRental()
            }), q().then(function() {
                customer.rent(car)
            }), q().then(function() {
                return Rental.findOne({ _id : customer.rentals }).exec();
            })]).spread(function(rent, rentals, finishRental, rent, rentals) {
                car = Examples.car();
                customer = Examples.customer();
                rent;
                assert.equal(1, count);
                finishRental;
                rent;
                assert.equal(2, count);
            });
        };
        behavior().then(done, done);
    });
});

