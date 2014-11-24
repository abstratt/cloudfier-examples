
var mongoose = require('mongoose');
var assert = require("assert");
var Q = require("q");
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
            var me = this;
            return Q.when(function() {
                console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return Examples.newCar();
            }).then(function(call_newCar) {
                car = call_newCar;
            });
        };
        behavior().then(done, done);
    });
    test('startsAsAvailable', function(done) {
        var behavior = function() {
            var car;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(function() {
                    console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Examples.newCar();
                }).then(function(call_newCar) {
                    car = call_newCar;
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.strictEqual(car['available'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                var me = this;
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCar();
                    }).then(function(call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("car['year'] = 1900;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                var me = this;
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCar();
                    }).then(function(call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("car['year'] = 2500;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                var me = this;
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCar();
                    }).then(function(call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("car['price'] = 49;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                var me = this;
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Examples.newCar();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Examples.newCar();
                    }).then(function(call_newCar) {
                        car = call_newCar;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("car['price'] = 2000;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                        console.log("assert.strictEqual(car['available'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(car['available'], true);
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
                        console.log("assert.strictEqual(!car['available'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(!car['available'], true);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("customer.finishRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
                });
            }).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("assert.strictEqual(car['available'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(car['available'], true);
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
                        console.log("assert.strictEqual(!car['available'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(!car['available'], true);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("customer.finishRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.strictEqual(car['available'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.strictEqual(car['available'], true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('unavailableWhenUnderRepair', function(done) {
        var behavior = function() {
            var car;
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
                        console.log("assert.strictEqual(!car['underRepair'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(!car['underRepair'], true);
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("car.startRepair();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        car.startRepair();
                    });
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.strictEqual(car['underRepair'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.strictEqual(car['underRepair'], true);
                });
            });
        };
        behavior().then(done, done);
    });
});

