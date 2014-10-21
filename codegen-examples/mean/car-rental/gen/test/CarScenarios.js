
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
        var car = Examples.car();
        done();
    });
    test('startsAsAvailable', function(done) {
        // a block
        var car = Examples.car();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        done();
    });
    test('tooOld', function(done) {
        try {
        // a block
        var car = Examples.car();
        car.year = 1900;
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('tooNew', function(done) {
        try {
        // a block
        var car = Examples.car();
        car.year = 2500;
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooLow', function(done) {
        try {
        // a block
        var car = Examples.car();
        car.price = 49;
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooHigh', function(done) {
        try {
        // a block
        var car = Examples.car();
        car.price = 2000;
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unavailableWhenRented', function(done) {
        // a block
        var car = Examples.car();
        var customer = Examples.customer();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        customer.rent(car);
        assert.ok(!(car.available) === true, '!(car.available): ' + !(car.available));
        customer.finishRental();
        done();
    });
    test('availableUponReturn', function(done) {
        // a block
        var car = Examples.car();
        var customer = Examples.customer();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        customer.rent(car);
        assert.ok(!(car.available) === true, '!(car.available): ' + !(car.available));
        customer.finishRental();
        assert.ok(car.available === true, 'car.available: ' + car.available);
        done();
    });
    test('unavailableWhenUnderRepair', function(done) {
        // a block
        var car = Examples.car();
        assert.ok(!(car.underRepair) === true, '!(car.underRepair): ' + !(car.underRepair));
        car.startRepair();
        assert.ok(car.underRepair === true, 'car.underRepair: ' + car.underRepair);
        done();
    });
});

