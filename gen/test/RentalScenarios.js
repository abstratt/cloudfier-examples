
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - RentalScenarios', function() {
    this.timeout(100000);

    test('startsAsInProgress', function(done) {
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
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        assert.ok(currentRental == null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return customer.rent(car);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        assert.ok(currentRental != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        assert.strictEqual(currentRental.isInProgress(), true);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
    test('finishedUponReturn', function(done) {
        var behavior = function() {
            var car;
            var customer;
            var rental;
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
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        rental = currentRental;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(Rental, 'findOne', [ ({ _id : rental._id }) ]);
                    }).then(function(rental) {
                        assert.strictEqual(rental.isInProgress(), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(Rental, 'findOne', [ ({ _id : rental._id }) ]);
                }).then(function(rental) {
                    assert.strictEqual(!(rental.isInProgress()), true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('oneCarPerCustomer', function(done) {
        var behavior = function() {
            var car1;
            var car2;
            var customer;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Examples.car();
                    }).then(function(car) {
                        car1 = car;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.customer();
                    }).then(function(customer) {
                        customer = customer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return customer.rent(car1);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Examples.car();
                    }).then(function(car) {
                        car2 = car;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return customer.rent(car2);
                    });
                });
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (no_current_rental), none occurred"));
        }, function(error) {
            try {
                assert.equal(error.name, 'Error');
                assert.ok(error.context);
                assert.equal(error.constraint, 'no_current_rental');
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
    test('carUnavailable', function(done) {
        var behavior = function() {
            var car;
            var customer1;
            var customer2;
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
                        customer1 = customer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return customer1.rent(car);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(car.isRented(), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.customer();
                    }).then(function(customer) {
                        customer2 = customer;
                    });
                }).then(function() {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                        }),
                        Q().then(function() {
                            return customer2;
                        })
                    ]).spread(function(car, customer2) {
                        return customer2.rent(car);
                    });
                });
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (car_available), none occurred"));
        }, function(error) {
            try {
                assert.equal(error.name, 'Error');
                assert.ok(error.context);
                assert.equal(error.constraint, 'car_available');
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
});

