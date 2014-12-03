
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
    this.timeout(100000);

    test('creation', function(done) {
        var behavior = function() {
            var car;
            var me = this;
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
                    return Q().then(function() {
                        console.log("assert.ok(car != null);\n");
                        assert.ok(car != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.ok(car.plate != null);\n");
                        assert.ok(car.plate != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        console.log("assert.ok(model != null);\n");
                        assert.ok(model != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        console.log("assert.ok(model.name != null);\n");
                        assert.ok(model.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        console.log("return Q.npost(Make, 'findOne', [ ({ _id : model.make }) ]);");
                        return Q.npost(Make, 'findOne', [ ({ _id : model.make }) ]);
                    }).then(function(make) {
                        console.log("assert.ok(make != null);\n");
                        assert.ok(make != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        console.log("return Q.npost(Make, 'findOne', [ ({ _id : model.make }) ]);");
                        return Q.npost(Make, 'findOne', [ ({ _id : model.make }) ]);
                    }).then(function(make) {
                        console.log("assert.ok(make.name != null);\n");
                        assert.ok(make.name != null);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
    test('startsAsValid', function(done) {
        var behavior = function() {
            var car;
            var me = this;
            return Q().then(function() {
                console.log("return Examples.newCar();");
                return Examples.newCar();
            }).then(function(newCar) {
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
                    console.log("car = newCar;\n");
                    car = newCar;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.strictEqual(car.available, true);\n");
                    assert.strictEqual(car.available, true);
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
                return /* Working set: [car] */Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCar();");
                        return Examples.newCar();
                    }).then(function(newCar) {
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("car['year'] = 1900;\n");
                        car['year'] = 1900;
                    });
                }).then(function(/*no-arg*/) {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(car, 'save', [  ]);
                        })
                    ]).spread(function() {
                        /* no-result */    
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
                return /* Working set: [car] */Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCar();");
                        return Examples.newCar();
                    }).then(function(newCar) {
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("car['year'] = 2500;\n");
                        car['year'] = 2500;
                    });
                }).then(function(/*no-arg*/) {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(car, 'save', [  ]);
                        })
                    ]).spread(function() {
                        /* no-result */    
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
                return /* Working set: [car] */Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCar();");
                        return Examples.newCar();
                    }).then(function(newCar) {
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("car['price'] = 49;\n");
                        car['price'] = 49;
                    });
                }).then(function(/*no-arg*/) {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(car, 'save', [  ]);
                        })
                    ]).spread(function() {
                        /* no-result */    
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
                return /* Working set: [car] */Q().then(function() {
                    return Q().then(function() {
                        console.log("return Examples.newCar();");
                        return Examples.newCar();
                    }).then(function(newCar) {
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("car['price'] = 2000;\n");
                        car['price'] = 2000;
                    });
                }).then(function(/*no-arg*/) {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(car, 'save', [  ]);
                        })
                    ]).spread(function() {
                        /* no-result */    
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
                        console.log("assert.equal(\"Available\", car.status);\n");
                        assert.equal("Available", car.status);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.rent(car);");
                        return customer.rent(car);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(\"Rented\", car.status);\n");
                    assert.equal("Rented", car.status);
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
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(car.available, true);\n");
                        assert.strictEqual(car.available, true);
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
                        console.log("assert.strictEqual(!car.available, true);\n");
                        assert.strictEqual(!car.available, true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return customer.finishRental();");
                        return customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.strictEqual(car.available, true);\n");
                    assert.strictEqual(car.available, true);
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
                        console.log("car = newCar;\n");
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(car.available, true);\n");
                        assert.strictEqual(car.available, true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(!car.underRepair, true);\n");
                        assert.strictEqual(!car.underRepair, true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return car.startRepair();");
                        return car.startRepair();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(!car.available, true);\n");
                        assert.strictEqual(!car.available, true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(car.underRepair, true);\n");
                        assert.strictEqual(car.underRepair, true);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

