
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
            var car;
            var customer;
            return q(/*sequential*/).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCustomer();
                    }).then(function(/*singleChild*/call_newCustomer) {
                        customer = call_newCustomer;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.rent(car);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Rental.findOne({ _id : customer.rentals }).exec();
                    }).then(function(/*singleChild*/read_rentals) {
                        assert.equal(1, /*TBD*/count);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.rent(car);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Rental.findOne({ _id : customer.rentals }).exec();
                    }).then(function(/*singleChild*/read_rentals) {
                        assert.equal(2, /*TBD*/count);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

