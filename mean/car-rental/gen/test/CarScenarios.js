
var assert = require("assert");
var Q = require("q");
var mongoose = require('../models/db.js');
require('../models/index.js');        


var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var CarModel = require('../models/CarModel.js');
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
                }).then(function(newCarResult) {
                    car = newCarResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.ok(car != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.ok(car.plate != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        assert.ok(model != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        assert.ok(model.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : model.make }) ]);
                    }).then(function(make) {
                        assert.ok(make != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : car.model }) ]);
                    }).then(function(model) {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : model.make }) ]);
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
            }).then(function(newCarResult) {
                car = newCarResult;
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
                }).then(function(newCarResult) {
                    car = newCarResult;
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
                }).then(function(newCarResult) {
                    car = newCarResult;
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
                }).then(function(newCarResult) {
                    car = newCarResult;
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
                }).then(function(newCarResult) {
                    car = newCarResult;
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
                }).then(function(newCarResult) {
                    car = newCarResult;
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
                    }).then(function(newCarResult) {
                        car = newCarResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.newCustomer();
                    }).then(function(newCustomerResult) {
                        customer = newCustomerResult;
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
                    return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
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
                    }).then(function(newCarResult) {
                        car = newCarResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Examples.newCustomer();
                    }).then(function(newCustomerResult) {
                        customer = newCustomerResult;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(car.isAvailable(), true);
                    });
                }).then(function() {
                    return Q.all([
                        Q().then(function() {
                            return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                        }),
                        Q().then(function() {
                            return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                        })
                    ]).spread(function(car, customer) {
                        return customer.rent(car);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return customer.getCurrentRental();
                    }).then(function(currentRental) {
                        rental = currentRental;
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(!(car.isAvailable()), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Customer.js'), 'findOne', [ ({ _id : customer._id }) ]);
                    }).then(function(customer) {
                        return customer.finishRental();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Rental.js'), 'findOne', [ ({ _id : rental._id }) ]);
                }).then(function(rental) {
                    return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : rental.car }) ]);
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
                    }).then(function(newCarResult) {
                        car = newCarResult;
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
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(!(car.isAvailable()), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(car.isUnderRepair(), true);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
    test('availableUponRepairCompletion', function(done) {
        var behavior = function() {
            var car;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Examples.newCar();
                    }).then(function(newCarResult) {
                        car = newCarResult;
                    });
                }).then(function() {
                    return Q().then(function() {
                        assert.strictEqual(car.isAvailable(), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return car.startRepair();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        assert.strictEqual(!(car.isAvailable()), true);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                    }).then(function(car) {
                        return car.finishRepair();
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                }).then(function(car) {
                    assert.strictEqual(car.isAvailable(), true);
                });
            });
        };
        behavior().then(done, done);
    });
});

