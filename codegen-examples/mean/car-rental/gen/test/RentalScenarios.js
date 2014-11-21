
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
        var behavior = function() {
            var car;
            var customer;
            return q(/*sequential*/).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCustomer();
                    }).then(function(/*singleChild*/call_newCustomer) {
                        customer = call_newCustomer;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return customer.getCurrentRental();
                    }).then(function(/*singleChild*/read_currentRental) {
                        assert.ok(read_currentRental == null);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.rent(car);
                    });
                });
            }).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return customer.getCurrentRental();
                    }).then(function(/*singleChild*/read_currentRental) {
                        assert.ok(read_currentRental != null);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return customer.getCurrentRental();
                    }).then(function(/*singleChild*/read_currentRental) {
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
            return q(/*sequential*/).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCustomer();
                    }).then(function(/*singleChild*/call_newCustomer) {
                        customer = call_newCustomer;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.rent(car);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        return customer.getCurrentRental();
                    }).then(function(/*singleChild*/read_currentRental) {
                        rental = read_currentRental;
                    });
                });
            }).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        assert.strictEqual(rental['inProgress'], true);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
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
                return q(/*sequential*/).then(function() {
                    return q(/*sequential*/).then(function() {
                        return q(/*leaf*/).then(function() {
                            return Examples.newCar();
                        }).then(function(/*singleChild*/call_newCar) {
                            car1 = call_newCar;
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
                            return Examples.newCustomer();
                        }).then(function(/*singleChild*/call_newCustomer) {
                            customer = call_newCustomer;
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
                            customer.rent(car1);
                        });
                    });
                }).then(function() {
                    return q(/*sequential*/).then(function() {
                        return q(/*leaf*/).then(function() {
                            return Examples.newCar();
                        }).then(function(/*singleChild*/call_newCar) {
                            car2 = call_newCar;
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
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
                return q(/*sequential*/).then(function() {
                    return q(/*sequential*/).then(function() {
                        return q(/*leaf*/).then(function() {
                            return Examples.newCar();
                        }).then(function(/*singleChild*/call_newCar) {
                            car = call_newCar;
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
                            return Examples.newCustomer();
                        }).then(function(/*singleChild*/call_newCustomer) {
                            customer1 = call_newCustomer;
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
                            customer1.rent(car);
                        });
                    });
                }).then(function() {
                    return q(/*sequential*/).then(function() {
                        return q(/*leaf*/).then(function() {
                            assert.strictEqual(car['rented'], true);
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
                            return Examples.newCustomer();
                        }).then(function(/*singleChild*/call_newCustomer) {
                            customer2 = call_newCustomer;
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
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

