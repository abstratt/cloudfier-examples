
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - CustomerScenarios', function() {
    this.timeout(100000);

    test('rentalHistory', function(done) {
        var behavior = function() {
            var car;
            var customer;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Examples.car();
                    }).then(function(car) {
                        car = car;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.customer();
                    }).then(function(customer) {
                        customer = customer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Rental, 'find', [ ({ customer : customer._id }) ]);
                    }).then(function(rentals) {
                        assert.equal(1, rentals.length);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                        }),
                        Q().then(function() {
                            return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                        })
                    ]).spread(function(car, customer) {
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return Q.npost(Rental, 'find', [ ({ customer : customer._id }) ]);
                    }).then(function(rentals) {
                        assert.equal(2, rentals.length);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

