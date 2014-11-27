
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
    this.timeout(1000);

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
                        console.log(newCar);
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCustomer();");
                        return Examples.newCustomer();
                    }).then(function(newCustomer) {
                        console.log(newCustomer);
                        console.log("customer = newCustomer;\n");
                        customer = newCustomer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log(currentRental);
                        console.log("assert.ok(currentRental == null);\n");
                        assert.ok(currentRental == null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("customer.rent(car);\n");
                        customer.rent(car);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log(currentRental);
                        console.log("assert.ok(currentRental != null);\n");
                        assert.ok(currentRental != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log(currentRental);
                        console.log("assert.strictEqual(currentRental['inProgress'], true);\n");
                        assert.strictEqual(currentRental['inProgress'], true);
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
                        console.log(newCar);
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCustomer();");
                        return Examples.newCustomer();
                    }).then(function(newCustomer) {
                        console.log(newCustomer);
                        console.log("customer = newCustomer;\n");
                        customer = newCustomer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("customer.rent(car);\n");
                        customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.getCurrentRental();");
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        console.log(currentRental);
                        console.log("rental = currentRental;\n");
                        rental = currentRental;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(rental['inProgress'], true);\n");
                        assert.strictEqual(rental['inProgress'], true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("customer.finishRental();\n");
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.strictEqual(!rental['inProgress'], true);\n");
                    assert.strictEqual(!rental['inProgress'], true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('oneCarPerCustomer', function(done) {
        try {
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
                            console.log(newCar);
                            console.log("car1 = newCar;\n");
                            car1 = newCar;
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("return Examples.newCustomer();");
                            return Examples.newCustomer();
                        }).then(function(newCustomer) {
                            console.log(newCustomer);
                            console.log("customer = newCustomer;\n");
                            customer = newCustomer;
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("customer.rent(car1);\n");
                            customer.rent(car1);
                        });
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q().then(function() {
                            console.log("return Examples.newCar();");
                            return Examples.newCar();
                        }).then(function(newCar) {
                            console.log(newCar);
                            console.log("car2 = newCar;\n");
                            car2 = newCar;
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("customer.rent(car2);\n");
                            customer.rent(car2);
                        });
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('carUnavailable', function(done) {
        try {
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
                            console.log(newCar);
                            console.log("car = newCar;\n");
                            car = newCar;
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("return Examples.newCustomer();");
                            return Examples.newCustomer();
                        }).then(function(newCustomer) {
                            console.log(newCustomer);
                            console.log("customer1 = newCustomer;\n");
                            customer1 = newCustomer;
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("customer1.rent(car);\n");
                            customer1.rent(car);
                        });
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q().then(function() {
                            console.log("assert.strictEqual(car['rented'], true);\n");
                            assert.strictEqual(car['rented'], true);
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("return Examples.newCustomer();");
                            return Examples.newCustomer();
                        }).then(function(newCustomer) {
                            console.log(newCustomer);
                            console.log("customer2 = newCustomer;\n");
                            customer2 = newCustomer;
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("customer2.rent(car);\n");
                            customer2.rent(car);
                        });
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
});

