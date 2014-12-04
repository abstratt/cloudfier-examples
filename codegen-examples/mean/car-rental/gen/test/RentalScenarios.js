
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
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log("assert.ok(currentRental == null);\n");
                        assert.ok(currentRental == null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.rent(car);");
                        return customer.rent(car);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);");
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log("assert.ok(currentRental != null);\n");
                        assert.ok(currentRental != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);");
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log("assert.strictEqual(currentRental.isInProgress(), true);\n");
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
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log("rental = currentRental;\n");
                        rental = currentRental;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Rental, 'findOne', [ ({ _id : rental._id }) ]);");
                        return Q.npost(Rental, 'findOne', [ ({ _id : rental._id }) ]);
                    }).then(function(rental) {
                        console.log("assert.strictEqual(rental.isInProgress(), true);\n");
                        assert.strictEqual(rental.isInProgress(), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);");
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        console.log("return customer.finishRental();");
                        return customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Rental, 'findOne', [ ({ _id : rental._id }) ]);");
                    return Q.npost(Rental, 'findOne', [ ({ _id : rental._id }) ]);
                }).then(function(rental) {
                    console.log("assert.strictEqual(!(rental.isInProgress()), true);\n");
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
                        console.log("return Examples.newCar();");
                        return Examples.newCar();
                    }).then(function(newCar) {
                        console.log("car1 = newCar;\n");
                        car1 = newCar;
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
                        console.log("return customer.rent(car1);");
                        return customer.rent(car1);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCar();");
                        return Examples.newCar();
                    }).then(function(newCar) {
                        console.log("car2 = newCar;\n");
                        car2 = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);");
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        console.log("return customer.rent(car2);");
                        return customer.rent(car2);
                    });
                });
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (customer_must_have_no_current_rental), none occurred"));
        }, function(error) {
            try {
                console.log(error);
                assert.equal(error.name, 'Error');
                assert.ok(error.context);
                assert.equal(error.constraint, 'customer_must_have_no_current_rental');
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
                        console.log("customer1 = newCustomer;\n");
                        customer1 = newCustomer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer1.rent(car);");
                        return customer1.rent(car);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("assert.strictEqual(car.isRented(), true);\n");
                        assert.strictEqual(car.isRented(), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCustomer();");
                        return Examples.newCustomer();
                    }).then(function(newCustomer) {
                        console.log("customer2 = newCustomer;\n");
                        customer2 = newCustomer;
                    });
                }).then(function() {
                    return Q.all([
                        Q().then(function() {
                            console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                            return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                        }),
                        Q().then(function() {
                            console.log("return customer2;");
                            return customer2;
                        })
                    ]).spread(function(car, customer2) {
                        console.log("car:" + car);console.log("customer2:" + customer2);
                        return customer2.rent(car);
                    });
                });
            });
        };
        behavior().then(function() {
            done(new Error("Error expected (car_must_be_available), none occurred"));
        }, function(error) {
            try {
                console.log(error);
                assert.equal(error.name, 'Error');
                assert.ok(error.context);
                assert.equal(error.constraint, 'car_must_be_available');
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
});

