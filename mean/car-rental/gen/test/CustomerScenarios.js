
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var CarModel = require('../models/CarModel.js');
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
                    return Examples.newCustomer();
                }).then(function(newCustomer) {
                    customer = newCustomer;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        assert.ok(customer != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        assert.ok(customer.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
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
                        return Examples.newCar();
                    }).then(function(newCar) {
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.newCustomer();
                    }).then(function(newCustomer) {
                        customer = newCustomer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Rental.js'), 'find', [ ({ customer : customer._id }) ]);
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
                            return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                        }),
                        Q().then(function() {
                            return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                        })
                    ]).spread(function(car, customer) {
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return Q.npost(require('../models/Rental.js'), 'find', [ ({ customer : customer._id }) ]);
                    }).then(function(rentals) {
                        assert.equal(2, rentals.length);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

