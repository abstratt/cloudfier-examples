
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - CarScenarios', function() {
    this.timeout(10000);

    test('startsAsValid', function(done) {
        var behavior = function() {
            var car;
            return q(/*leaf*/).then(function() {
                return Examples.newCar();
            }).then(function(/*singleChild*/call_newCar) {
                car = call_newCar;
            });
        };
        behavior().then(done, done);
    });
    test('startsAsAvailable', function(done) {
        var behavior = function() {
            var car;
            return q(/*sequential*/).then(function() {
                return q(/*leaf*/).then(function() {
                    return Examples.newCar();
                }).then(function(/*singleChild*/call_newCar) {
                    car = call_newCar;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.strictEqual(car['available'], true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('tooOld', function(done) {
        try {
            var behavior = function() {
                var car;
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        car['year'] = 1900;
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('tooNew', function(done) {
        try {
            var behavior = function() {
                var car;
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        car['year'] = 2500;
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooLow', function(done) {
        try {
            var behavior = function() {
                var car;
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        car['price'] = 49;
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('priceIsTooHigh', function(done) {
        try {
            var behavior = function() {
                var car;
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        car['price'] = 2000;
                    });
                });
            };
            behavior().then(done, done);
        } catch (e) {
            return;
        }
        throw "Failure expected, but no failure occurred"
    });
    test('unavailableWhenRented', function(done) {
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
                        assert.strictEqual(car['available'], true);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.rent(car);
                    });
                });
            }).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        assert.strictEqual(!car['available'], true);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.finishRental();
                    });
                });
            });
        };
        behavior().then(done, done);
    });
    test('availableUponReturn', function(done) {
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
                });
            }).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        assert.strictEqual(car['available'], true);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.rent(car);
                    });
                });
            }).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        assert.strictEqual(!car['available'], true);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.strictEqual(car['available'], true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('unavailableWhenUnderRepair', function(done) {
        var behavior = function() {
            var car;
            return q(/*sequential*/).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Examples.newCar();
                    }).then(function(/*singleChild*/call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        assert.strictEqual(!car['underRepair'], true);
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        car.startRepair();
                    });
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.strictEqual(car['underRepair'], true);
                });
            });
        };
        behavior().then(done, done);
    });
});

