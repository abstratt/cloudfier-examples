
var mongoose = require('mongoose');

var assert = require("assert");

var Examples = require('./Examples.js');


suite('Car rental functional tests - CustomerScenarios', function() {
    this.timeout(10000);

    test('rentalHistory', function(done) {
        var car = Examples.car();
        var customer = Examples.customer();
        customer.rent(car);
        assert.equal(1, count, '1 == count');
        customer.finishRental();
        customer.rent(car);
        assert.equal(2, count, '2 == count');
        done();
    });
});

