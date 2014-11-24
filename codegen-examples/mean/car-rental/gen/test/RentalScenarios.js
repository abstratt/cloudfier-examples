
var mongoose = require('mongoose');
var assert = require("assert");
var Q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - RentalScenarios', function() {
    this.timeout(10000);

    test('startsAsInProgress', function(done) {
        var behavior = function() {
            var car;
            var customer;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCar();
                    }).then(function(call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCustomer();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCustomer();
                    }).then(function(call_newCustomer) {
                        customer = call_newCustomer;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return customer.getCurrentRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return customer.getCurrentRental();
                    }).then(function(read_currentRental) {
                        assert.ok(read_currentRental == null);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("customer.rent(car);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        customer.rent(car);
                    });
                });
            }).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return customer.getCurrentRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return customer.getCurrentRental();
                    }).then(function(read_currentRental) {
                        assert.ok(read_currentRental != null);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return customer.getCurrentRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return customer.getCurrentRental();
                    }).then(function(read_currentRental) {
                        assert.strictEqual(read_currentRental['inProgress'], true);
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
            return Q.when(null).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCar();
                    }).then(function(call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCustomer();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCustomer();
                    }).then(function(call_newCustomer) {
                        customer = call_newCustomer;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("customer.rent(car);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        customer.rent(car);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("return customer.getCurrentRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return customer.getCurrentRental();
                    }).then(function(read_currentRental) {
                        rental = read_currentRental;
                    });
                });
            }).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("assert.strictEqual(rental['inProgress'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(rental['inProgress'], true);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("customer.finishRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.strictEqual(!rental['inProgress'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                return Q.when(null).then(function() {
                    return Q.when(null).then(function() {
                        return Q.when(function() {
                            console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Examples.newCar();
                        }).then(function(call_newCar) {
                            car1 = call_newCar;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("return Examples.newCustomer();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Examples.newCustomer();
                        }).then(function(call_newCustomer) {
                            customer = call_newCustomer;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("customer.rent(car1);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            customer.rent(car1);
                        });
                    });
                }).then(function() {
                    return Q.when(null).then(function() {
                        return Q.when(function() {
                            console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Examples.newCar();
                        }).then(function(call_newCar) {
                            car2 = call_newCar;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("customer.rent(car2);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                return Q.when(null).then(function() {
                    return Q.when(null).then(function() {
                        return Q.when(function() {
                            console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Examples.newCar();
                        }).then(function(call_newCar) {
                            car = call_newCar;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("return Examples.newCustomer();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Examples.newCustomer();
                        }).then(function(call_newCustomer) {
                            customer1 = call_newCustomer;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("customer1.rent(car);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            customer1.rent(car);
                        });
                    });
                }).then(function() {
                    return Q.when(null).then(function() {
                        return Q.when(function() {
                            console.log("assert.strictEqual(car['rented'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            assert.strictEqual(car['rented'], true);
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("return Examples.newCustomer();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            return Examples.newCustomer();
                        }).then(function(call_newCustomer) {
                            customer2 = call_newCustomer;
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("customer2.rent(car);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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

