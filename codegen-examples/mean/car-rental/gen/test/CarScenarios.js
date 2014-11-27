
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - CarScenarios', function() {
    this.timeout(1000);

    test('startsAsValid', function(done) {
        var behavior = function() {
            var car;
            var me = this;
            return Q().then(function() {
                console.log("return Examples.newCar();");
                return Examples.newCar();
            }).then(function(newCar) {
                console.log(newCar);
                console.log("car = newCar;\n");
                car = newCar;
            });
        };
        behavior().then(done, done);
    });
    test('startsAsAvailable', function(done) {
        var behavior = function() {
            var car;
            var me = this;
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
                    console.log("assert.strictEqual(car['available'], true);\n");
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
                        console.log("car['year'] = 1900;\n");
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
                        console.log("car['year'] = 2500;\n");
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
                        console.log("car['price'] = 49;\n");
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
                        console.log("car['price'] = 2000;\n");
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
                        console.log("assert.equal(\"Available\", car['status']);\n");
                        assert.equal("Available", car['status']);
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
                        console.log("assert.equal(\"Rented\", car['status']);\n");
                        assert.equal("Rented", car['status']);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("customer.finishRental();\n");
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
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(car['available'], true);\n");
                        assert.strictEqual(car['available'], true);
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
                        console.log("assert.strictEqual(!car['available'], true);\n");
                        assert.strictEqual(!car['available'], true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("customer.finishRental();\n");
                        customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.strictEqual(car['available'], true);\n");
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
                        console.log("assert.strictEqual(car['available'], true);\n");
                        assert.strictEqual(car['available'], true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(!car['underRepair'], true);\n");
                        assert.strictEqual(!car['underRepair'], true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("car.startRepair();\n");
                        car.startRepair();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(!car['available'], true);\n");
                        assert.strictEqual(!car['available'], true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(car['underRepair'], true);\n");
                        assert.strictEqual(car['underRepair'], true);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

