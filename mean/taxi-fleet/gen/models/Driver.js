var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Shift = require('./Shift.js');
var Taxi = require('./Taxi.js');
var Charge = require('./Charge.js');

/**
 *  Drivers that can book taxis. 
 */
// declare schema
var driverSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    taxi : {
        type : Schema.Types.ObjectId,
        ref : "Taxi"
    },
    charges : [{
        type : Schema.Types.ObjectId,
        ref : "Charge",
        "default" : []
    }]
});


/*************************** ACTIONS ***************************/

/**
 *  Book a taxi that is currently available 
 */
driverSchema.methods.book = function (toRent) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return <UNSUPPORTED: CallOperationAction> (exists)>;
        }).then(function(existsResult) {
            return existsResult;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: No taxis available (on 'taxi_fleet::Driver::book')");
            error.context = 'taxi_fleet::Driver::book';
            error.constraint = '';
            error.description = 'No taxis available';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q.npost(require('./Taxi.js'), 'findOne', [ ({ _id : toRent._id }) ]);
        }).then(function(toRent) {
            return toRent.isFull();
        }).then(function(full) {
            return !(full);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Taxi is not available (on 'taxi_fleet::Driver::book')");
            error.context = 'taxi_fleet::Driver::book';
            error.constraint = '';
            error.description = 'Taxi is not available';
            throw error;
        }    
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return Q.npost(require('./Taxi.js'), 'findOne', [ ({ _id : toRent._id }) ]);
            }),
            Q().then(function() {
                return Q.npost(require('./Taxi.js'), 'findOne', [ ({ _id : me.taxi }) ]);
            })
        ]).spread(function(toRent, taxi) {
            return !(toRent == taxi);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Taxi already booked by this driver (on 'taxi_fleet::Driver::book')");
            error.context = 'taxi_fleet::Driver::book';
            error.constraint = '';
            error.description = 'Taxi already booked by this driver';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(require('./Taxi.js'), 'findOne', [ ({ _id : toRent._id }) ]);
            }),
            Q().then(function() {
                return me;
            })
        ]).spread(function(toRent, readSelfAction) {
            readSelfAction.taxi = toRent._id;
            toRent.drivers.push(readSelfAction._id);
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

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isHasBooking();
        }).then(function(hasBooking) {
            return hasBooking;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: No bookings to release (on 'taxi_fleet::Driver::release')");
            error.context = 'taxi_fleet::Driver::release';
            error.constraint = '';
            error.description = 'No bookings to release';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(require('./Taxi.js'), 'findOne', [ ({ _id : me.taxi }) ]);
            }),
            Q().then(function() {
                return me;
            })
        ]).spread(function(taxi, readSelfAction) {
            taxi.drivers = null;
            taxi = null;
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

driverSchema.methods.isHasBooking = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Taxi.js'), 'findOne', [ ({ _id : me.taxi }) ]);
        }),
        Q().then(function() {
            return null;
        })
    ]).spread(function(taxi, valueSpecificationAction) {
        return !(taxi == valueSpecificationAction);
    });
};

driverSchema.methods.isPaymentDue = function () {
    var me = this;
    return Q().then(function() {
        return me.getPendingCharges();
    }).then(function(pendingCharges) {
        return /*TBD*/isEmpty;
    }).then(function(isEmptyResult) {
        return !(isEmptyResult);
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Charge.js'), 'find', [ ({ driver : me._id }) ]);
    }).then(function(charges) {
        return charges.where({
            $ne : [ 
                { status : null },
                true
            ]
        });
    }).then(function(selectResult) {
        return selectResult;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Driver', driverSchema);
