
var mongoose = require('mongoose');
var assert = require("assert");
var Q = require("q");
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
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCar();
                    }).then(function(call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCustomer();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCustomer();
                    }).then(function(call_newCustomer) {
                        customer = call_newCustomer;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("customer.rent(car);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        customer.rent(car);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return Rental.find({ customer : customer._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Rental.find({ customer : customer._id }).exec();
                    }).then(function(read_rentals) {
                        assert.equal(1, /*TBD*/count);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("customer.finishRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("customer.rent(car);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        customer.rent(car);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return Rental.find({ customer : customer._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Rental.find({ customer : customer._id }).exec();
                    }).then(function(read_rentals) {
                        assert.equal(2, /*TBD*/count);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

