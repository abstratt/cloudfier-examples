
var mongoose = require('mongoose');
var HttpClient = require("../http-client.js");
var helpers = require('../helpers.js');
var util = require('util');
var q = require('q');

var assert = require("assert");
var folder = process.env.KIRRA_FOLDER || 'cloudfier-examples';

var kirraBaseUrl = process.env.KIRRA_BASE_URL || "http://localhost:48084";
var kirraApiUrl = process.env.KIRRA_API_URL || (kirraBaseUrl);
var httpClient = new HttpClient(kirraApiUrl);
var Examples = require('./Examples.js');

suite('Car rental functional tests - RentalScenarios', function() {
    this.timeout(10000);

    
    test('startsAsInProgress', function(done) {
        // a block
        var car = require('./Examples.js').car();
        var customer = require('./Examples.js').customer();
        assert.ok(customer.getCurrentRental() == null, 'customer.getCurrentRental()');
        customer.rent(car);
        assert.ok(customer.getCurrentRental() != null, 'customer.getCurrentRental(): ' + customer.getCurrentRental());
        assert.ok(customer.getCurrentRental().inProgress === true, 'customer.getCurrentRental().inProgress: ' + customer.getCurrentRental().inProgress);
        done();
    });
    test('finishedUponReturn', function(done) {
        // a block
        var car = require('./Examples.js').car();
        var customer = require('./Examples.js').customer();
        customer.rent(car);
        var rental = customer.getCurrentRental();
        assert.ok(rental.inProgress === true, 'rental.inProgress: ' + rental.inProgress);
        customer.finishRental();
        assert.ok(!(rental.inProgress) === true, '!(rental.inProgress): ' + !(rental.inProgress));
        done();
    });
    test('oneCarPerCustomer', function(done) {
        // a block
        var car1 = require('./Examples.js').car();
        var customer = require('./Examples.js').customer();
        customer.rent(car1);
        var car2 = require('./Examples.js').car();
        customer.rent(car2);
        done();
    });
    test('carUnavailable', function(done) {
        // a block
        var car = require('./Examples.js').car();
        var customer1 = require('./Examples.js').customer();
        customer1.rent(car);
        assert.ok(car.rented === true, 'car.rented: ' + car.rented);
        var customer2 = require('./Examples.js').customer();
        customer2.rent(car);
        done();
    });
});

