
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
        q().then(function () {
            car = Examples.car();
            customer = Examples.customer();
            customer.rent(car);
            assert.equal(1, count, '1 == count');
            customer.finishRental();
        }).then(function () {
            customer.rent(car);
            assert.equal(2, count, '2 == count');
        }).then(done, done);
    });
});

