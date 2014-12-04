
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
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("assert.ok(car != null);\n");
                        assert.ok(car != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("assert.ok(car.plate != null);\n");
                        assert.ok(car.plate != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        console.log("assert.ok(model != null);\n");
                        assert.ok(model != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        console.log("assert.ok(model.name != null);\n");
                        assert.ok(model.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
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
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
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
                    console.log("assert.strictEqual(car.isAvailable(), true);\n");
                    assert.strictEqual(car.isAvailable(), true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('tooOld', function(done) {
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
        behavior().then(function() {
            done(new Error("Error expected (above_minimum), none occurred"));
        }, function(error) {
            try {
                console.log(error);
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.year);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
    test('tooNew', function(done) {
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
        behavior().then(function() {
            done(new Error("Error expected (below_maximum), none occurred"));
        }, function(error) {
            try {
                console.log(error);
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.year);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
    test('priceIsTooLow', function(done) {
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
        behavior().then(function() {
            done(new Error("Error expected (above_minimum), none occurred"));
        }, function(error) {
            try {
                console.log(error);
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.price);
                done();
            } catch (e) {
                done(e);
            }                
        });
    });
    test('priceIsTooHigh', function(done) {
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
        behavior().then(function() {
            done(new Error("Error expected (below_maximum), none occurred"));
        }, function(error) {
            try {
                console.log(error);
                assert.equal(error.name, 'ValidationError');
                assert.ok(error.errors.price);
                done();
            } catch (e) {
                done(e);
            }                
        });
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
                    console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                    return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                }).then(function(car) {
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
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("assert.strictEqual(car.isAvailable(), true);\n");
                        assert.strictEqual(car.isAvailable(), true);
                    });
                }).then(function() {
                    return Q.all([
                        Q().then(function() {
                            console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                            return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                        }),
                        Q().then(function() {
                            console.log("return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);");
                            return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                        })
                    ]).spread(function(car, customer) {
                        console.log("car:" + car);console.log("customer:" + customer);
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);");
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
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
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("assert.strictEqual(!(car.isAvailable()), true);\n");
                        assert.strictEqual(!(car.isAvailable()), true);
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
                    console.log("return Q.npost(Car, 'findOne', [ ({ _id : rental.car }) ]);");
                    return Q.npost(Car, 'findOne', [ ({ _id : rental.car }) ]);
                }).then(function(car) {
                    console.log("assert.strictEqual(car.isAvailable(), true);\n");
                    assert.strictEqual(car.isAvailable(), true);
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
                        console.log("assert.strictEqual(car.isAvailable(), true);\n");
                        assert.strictEqual(car.isAvailable(), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(!(car.isUnderRepair()), true);\n");
                        assert.strictEqual(!(car.isUnderRepair()), true);
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
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("assert.strictEqual(!(car.isAvailable()), true);\n");
                        assert.strictEqual(!(car.isAvailable()), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);");
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        console.log("assert.strictEqual(car.isUnderRepair(), true);\n");
                        assert.strictEqual(car.isUnderRepair(), true);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

