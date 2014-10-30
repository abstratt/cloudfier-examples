
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - RentalScenarios', function() {
    this.timeout(10000);

    test('startsAsInProgress', function(done) {
        var car, customer;
        return q().then(function () {
            console.log("car = Examples.car()");
            car = Examples.car();
            
            console.log("customer = Examples.customer()");
            customer = Examples.customer();
            
            console.log("assert.ok(customer.getCurrentRental() == null, 'customer.getCurrentRental() == null')");
            assert.ok(customer.getCurrentRental() == null, 'customer.getCurrentRental() == null');
            
            console.log("customer.rent(car)");
            customer.rent(car);
        }).then(function () {
            console.log("assert.ok(customer.getCurrentRental() != null, 'customer.getCurrentRental() != null')");
            assert.ok(customer.getCurrentRental() != null, 'customer.getCurrentRental() != null');
            
            console.log("assert.strictEqual(customer.getCurrentRental().inProgress, true, 'customer.getCurrentRental().inProgress === true')");
            assert.strictEqual(customer.getCurrentRental().inProgress, true, 'customer.getCurrentRental().inProgress === true');
        });
    });
    test('finishedUponReturn', function(done) {
        var car, customer, rental;
        return q().then(function () {
            console.log("car = Examples.car()");
            car = Examples.car();
            
            console.log("customer = Examples.customer()");
            customer = Examples.customer();
            
            console.log("customer.rent(car)");
            customer.rent(car);
            
            console.log("rental = customer.getCurrentRental()");
            rental = customer.getCurrentRental();
        }).then(function () {
            console.log("assert.strictEqual(rental.inProgress, true, 'rental.inProgress === true')");
            assert.strictEqual(rental.inProgress, true, 'rental.inProgress === true');
            
            console.log("customer.finishRental()");
            customer.finishRental();
        }).then(function () {
            console.log("assert.strictEqual(!rental.inProgress, true, '!rental.inProgress === true')");
            assert.strictEqual(!rental.inProgress, true, '!rental.inProgress === true');
        });
    });
    test('oneCarPerCustomer', function(done) {
        try {
            var car1, car2, customer;
            return q().then(function () {
                console.log("car1 = Examples.car()");
                car1 = Examples.car();
                
                console.log("customer = Examples.customer()");
                customer = Examples.customer();
                
                console.log("customer.rent(car1)");
                customer.rent(car1);
            }).then(function () {
                console.log("car2 = Examples.car()");
                car2 = Examples.car();
                
                console.log("customer.rent(car2)");
                customer.rent(car2);
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('carUnavailable', function(done) {
        try {
            var car, customer1, customer2;
            return q().then(function () {
                console.log("car = Examples.car()");
                car = Examples.car();
                
                console.log("customer1 = Examples.customer()");
                customer1 = Examples.customer();
                
                console.log("customer1.rent(car)");
                customer1.rent(car);
            }).then(function () {
                console.log("assert.strictEqual(car.rented, true, 'car.rented === true')");
                assert.strictEqual(car.rented, true, 'car.rented === true');
                
                console.log("customer2 = Examples.customer()");
                customer2 = Examples.customer();
                
                console.log("customer2.rent(car)");
                customer2.rent(car);
            });
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

