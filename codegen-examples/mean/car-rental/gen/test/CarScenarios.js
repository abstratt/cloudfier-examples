
var mongoose = require('mongoose');

var assert = require("assert");

var Examples = require('./Examples.js');

var CarScenarios = {
};

suite('Car rental functional tests - CarScenarios', function() {
    this.timeout(10000);

    test('startsAsValid', function(done) {
        var car = Examples.car();
        done();
    });
    test('startsAsAvailable', function(done) {
        var car = Examples.car();
        assert.strictEqual(car.available, true, 'car.available === true');
        done();
    });
    test('tooOld', function(done) {
        try {
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
        var car = Examples.car();
        car.price = 2000;
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unavailableWhenRented', function(done) {
        var car = Examples.car();
        var customer = Examples.customer();
        assert.strictEqual(car.available, true, 'car.available === true');
        customer.rent(car);
        assert.strictEqual(!car.available, true, '!car.available === true');
        customer.finishRental();
        done();
    });
    test('availableUponReturn', function(done) {
        var car = Examples.car();
        var customer = Examples.customer();
        assert.strictEqual(car.available, true, 'car.available === true');
        customer.rent(car);
        assert.strictEqual(!car.available, true, '!car.available === true');
        customer.finishRental();
        assert.strictEqual(car.available, true, 'car.available === true');
        done();
    });
    test('unavailableWhenUnderRepair', function(done) {
        var car = Examples.car();
        assert.strictEqual(!car.underRepair, true, '!car.underRepair === true');
        car.startRepair();
        assert.strictEqual(car.underRepair, true, 'car.underRepair === true');
        done();
    });
});

