
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
        var car, customer;
        return q().then(function () {
            console.log("car = Examples.car()");
            car = Examples.car();
            
            console.log("customer = Examples.customer()");
            customer = Examples.customer();
            
            console.log("customer.rent(car)");
            customer.rent(car);
            
            console.log("assert.equal(1, count, '1 == count')");
            assert.equal(1, count, '1 == count');
            
            console.log("customer.finishRental()");
            customer.finishRental();
        }).then(function () {
            console.log("customer.rent(car)");
            customer.rent(car);
            
            console.log("assert.equal(2, count, '2 == count')");
            assert.equal(2, count, '2 == count');
        });
    });
});

