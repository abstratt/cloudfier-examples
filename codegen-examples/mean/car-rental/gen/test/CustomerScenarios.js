
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

    test('creation', function(done) {
        var behavior = function() {
            var customer;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    console.log("return Examples.newCustomer();");
                    return Examples.newCustomer();
                }).then(function(newCustomer) {
                    console.log("customer = newCustomer;\n");
                    customer = newCustomer;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("assert.ok(customer != null);\n");
                        assert.ok(customer != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.ok(customer.name != null);\n");
                        assert.ok(customer.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.equal(\"Joana de Almeida\", customer.name);\n");
                        assert.equal("Joana de Almeida", customer.name);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
    test('rentalHistory', function(done) {
        var behavior = function() {
            var car;
            var customer;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCar();");
                        return Examples.newCar();
                    }).then(function(newCar) {
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCustomer();");
                        return Examples.newCustomer();
                    }).then(function(newCustomer) {
                        console.log("customer = newCustomer;\n");
                        customer = newCustomer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.rent(car);");
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Rental, 'find', [ ({ customer : customer._id }) ]);");
                        return Q.npost(Rental, 'find', [ ({ customer : customer._id }) ]);
                    }).then(function(rentals) {
                        console.log("assert.equal(1, rentals.length);\n");
                        assert.equal(1, rentals.length);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.finishRental();");
                        return customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return customer.rent(car);");
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Rental, 'find', [ ({ customer : customer._id }) ]);");
                        return Q.npost(Rental, 'find', [ ({ customer : customer._id }) ]);
                    }).then(function(rentals) {
                        console.log("assert.equal(2, rentals.length);\n");
                        assert.equal(2, rentals.length);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

