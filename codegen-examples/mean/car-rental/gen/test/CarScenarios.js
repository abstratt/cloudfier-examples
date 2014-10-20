
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

suite('Car rental functional tests - CarScenarios', function() {
    this.timeout(10000);

    
    test('startsAsValid', function(done) {
        // a block
        var car = require('./Examples.js').car();
        done();
    });
    test('startsAsAvailable', function(done) {
        // a block
        var car = require('./Examples.js').car();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        done();
    });
    test('tooOld', function(done) {
        // a block
        var car = require('./Examples.js').car();
        car.year = 1900;
        done();
    });
    test('tooNew', function(done) {
        // a block
        var car = require('./Examples.js').car();
        car.year = 2500;
        done();
    });
    test('priceIsTooLow', function(done) {
        // a block
        var car = require('./Examples.js').car();
        car.price = 49;
        done();
    });
    test('priceIsTooHigh', function(done) {
        // a block
        var car = require('./Examples.js').car();
        car.price = 2000;
        done();
    });
    test('unavailableWhenRented', function(done) {
        // a block
        var car = require('./Examples.js').car();
        var customer = require('./Examples.js').customer();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        customer.rent(car);
        assert.ok(!(car.available) === true, '!(car.available): ' + !(car.available));
        customer.finishRental();
        done();
    });
    test('availableUponReturn', function(done) {
        // a block
        var car = require('./Examples.js').car();
        var customer = require('./Examples.js').customer();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        customer.rent(car);
        assert.ok(!(car.available) === true, '!(car.available): ' + !(car.available));
        customer.finishRental();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        done();
    });
    test('unavailableWhenUnderRepair', function(done) {
        // a block
        var car = require('./Examples.js').car();
        car.startRepair();
        assert.ok(car.underRepair === true, 'car.underRepair: ' + car.underRepair);
        done();
    });
});

