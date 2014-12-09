
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
                    return Examples.newCar();
                }).then(function(newCar) {
                    car = newCar;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.ok(car != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.ok(car.plate != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        assert.ok(model != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        assert.ok(model.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        return Q.npost(Make, 'findOne', [ ({ _id : model.make }) ]);
                    }).then(function(make) {
                        assert.ok(make != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        return Q.npost(Make, 'findOne', [ ({ _id : model.make }) ]);
                    }).then(function(make) {
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
                return Examples.newCar();
            }).then(function(newCar) {
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
                    return Examples.newCar();
                }).then(function(newCar) {
                    car = newCar;
                });
            }).then(function() {
                return Q().then(function() {
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
                    return Examples.newCar();
                }).then(function(newCar) {
                    car = newCar;
                });
            }).then(function() {
                return Q().then(function() {
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
                    return Examples.newCar();
                }).then(function(newCar) {
                    car = newCar;
                });
            }).then(function() {
                return Q().then(function() {
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
                    return Examples.newCar();
                }).then(function(newCar) {
                    car = newCar;
                });
            }).then(function() {
                return Q().then(function() {
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
                    return Examples.newCar();
                }).then(function(newCar) {
                    car = newCar;
                });
            }).then(function() {
                return Q().then(function() {
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
                        return Examples.newCar();
                    }).then(function(newCar) {
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.newCustomer();
                    }).then(function(newCustomer) {
                        customer = newCustomer;
                    });
                }).then(function() {
                    return Q().then(function() {
                        assert.equal("Available", car.status);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return customer.rent(car);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                }).then(function(car) {
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
                        return Examples.newCar();
                    }).then(function(newCar) {
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.newCustomer();
                    }).then(function(newCustomer) {
                        customer = newCustomer;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(car.isAvailable(), true);
                    });
                }).then(function() {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                        }),
                        Q().then(function() {
                            return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                        })
                    ]).spread(function(car, customer) {
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Customer, 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        rental = currentRental;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(!(car.isAvailable()), true);
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
                    return Q.npost(Car, 'findOne', [ ({ _id : rental.car }) ]);
                }).then(function(car) {
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
                        return Examples.newCar();
                    }).then(function(newCar) {
                        car = newCar;
                    });
                }).then(function() {
                    return Q().then(function() {
                        assert.strictEqual(car.isAvailable(), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        assert.strictEqual(!(car.isUnderRepair()), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return car.startRepair();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(!(car.isAvailable()), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(Car, 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.equal("UnderRepair", car.status);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

