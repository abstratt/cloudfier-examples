var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var CarModel = require('./CarModel.js');
var Car = require('./Car.js');
var Rental = require('./Rental.js');

// declare schema
var customerSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    rentals : [{
        type : Schema.Types.ObjectId,
        ref : "Rental",
        "default" : []
    }]
});
//            customerSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

customerSchema.methods.rent = function (car) {
    var rental;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return Q.npost(require('./Car.js'), 'findOne', [ ({ _id : car._id }) ]);
        }).then(function(car) {
            return car.isAvailable();
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: car_must_be_available (on 'car_rental::Customer::rent')");
            error.context = 'car_rental::Customer::rent';
            error.constraint = 'car_must_be_available';
            throw error;
        }    
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return me.getCurrentRental();
            }),
            Q().then(function() {
                return null;
            })
        ]).spread(function(currentRental, valueSpecificationAction) {
            return currentRental == valueSpecificationAction;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: customer_must_have_no_current_rental (on 'car_rental::Customer::rent')");
            error.context = 'car_rental::Customer::rent';
            error.constraint = 'customer_must_have_no_current_rental';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                rental = new require('./Rental.js')();
            });
        }).then(function() {
            return Q().then(function() {
                rental.customer = me._id;
                me.rentals.push(rental._id);
            });
        }).then(function() {
            return Q.all([
                Q().then(function() {
                    return Q.npost(require('./Car.js'), 'findOne', [ ({ _id : car._id }) ]);
                }),
                Q().then(function() {
                    return rental;
                })
            ]).spread(function(car, rental) {
                rental.car = car._id;
                car.rentals.push(rental._id);
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(require('./Car.js'), 'findOne', [ ({ _id : car._id }) ]);
            }).then(function(car) {
                return car.carRented();;
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                }),
                Q().then(function() {
                    return Q.npost(rental, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
    });
};

customerSchema.methods.finishRental = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isHasCurrentRental();
        }).then(function(hasCurrentRental) {
            return hasCurrentRental;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: current_rental_exists (on 'car_rental::Customer::finishRental')");
            error.context = 'car_rental::Customer::finishRental';
            error.constraint = 'current_rental_exists';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                return me.getCurrentRental();
            }).then(function(currentRental) {
                return Q.npost(require('./Car.js'), 'findOne', [ ({ _id : currentRental.car }) ]);
            }).then(function(car) {
                return car.carReturned();;
            });
        }).then(function() {
            return Q().then(function() {
                return me.getCurrentRental();
            }).then(function(currentRental) {
                return currentRental.finish();
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.methods.isHasCurrentRental = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return me.getCurrentRental();
        }),
        Q().then(function() {
            return null;
        })
    ]).spread(function(currentRental, valueSpecificationAction) {
        return !(currentRental == valueSpecificationAction);
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    var me = this;
    return Q().then(function() {
        return require('./Rental.js').currentForCustomer(me);
    }).then(function(currentForCustomer) {
        return currentForCustomer;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
