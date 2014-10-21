
var mongoose = require('mongoose');

var assert = require("assert");

var Examples = require('./Examples.js');


suite('Car rental functional tests - RentalScenarios', function() {
    this.timeout(10000);

    test('startsAsInProgress', function(done) {
        var car = Examples.car();
        var customer = Examples.customer();
        assert.ok(customer.getCurrentRental() == null, 'customer.getCurrentRental() == null');
        customer.rent(car);
        assert.ok(customer.getCurrentRental() != null, 'customer.getCurrentRental() != null');
        assert.strictEqual(customer.getCurrentRental().inProgress, true, 'customer.getCurrentRental().inProgress === true');
        done();
    });
    test('finishedUponReturn', function(done) {
        var car = Examples.car();
        var customer = Examples.customer();
        customer.rent(car);
        var rental = customer.getCurrentRental();
        assert.strictEqual(rental.inProgress, true, 'rental.inProgress === true');
        customer.finishRental();
        assert.strictEqual(!rental.inProgress, true, '!rental.inProgress === true');
        done();
    });
    test('oneCarPerCustomer', function(done) {
        try {
            var car1 = Examples.car();
            var customer = Examples.customer();
            customer.rent(car1);
            var car2 = Examples.car();
            customer.rent(car2);
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('carUnavailable', function(done) {
        try {
            var car = Examples.car();
            var customer1 = Examples.customer();
            customer1.rent(car);
            assert.strictEqual(car.rented, true, 'car.rented === true');
            var customer2 = Examples.customer();
            customer2.rent(car);
        } catch (e) {
            done();
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

