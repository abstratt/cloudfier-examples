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
//            driverSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

/**
 *  Book a taxi that is currently available 
 */
driverSchema.methods.book = function (toRent) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return <UNSUPPORTED: CallOperationAction> (exists);\n");
            return <UNSUPPORTED: CallOperationAction> (exists);
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
            console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : toRent._id }) ]);");
            return Q.npost(Taxi, 'findOne', [ ({ _id : toRent._id }) ]);
        }).then(function(toRent) {
            console.log("return toRent.isFull();");
            return toRent.isFull();
        }).then(function(full) {
            console.log("return !(full);\n");
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
                console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : toRent._id }) ]);");
                return Q.npost(Taxi, 'findOne', [ ({ _id : toRent._id }) ]);
            }),
            Q().then(function() {
                console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : me.taxi }) ]);");
                return Q.npost(Taxi, 'findOne', [ ({ _id : me.taxi }) ]);
            })
        ]).spread(function(toRent, taxi) {
            console.log("toRent:" + toRent);console.log("taxi:" + taxi);
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
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : toRent._id }) ]);");
                return Q.npost(Taxi, 'findOne', [ ({ _id : toRent._id }) ]);
            }),
            Q().then(function() {
                console.log("return me;");
                return me;
            })
        ]).spread(function(toRent, readSelfAction) {
            console.log("toRent:" + toRent);console.log("readSelfAction:" + readSelfAction);
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
            console.log("return me.isHasBooking();");
            return me.isHasBooking();
        }).then(function(hasBooking) {
            console.log("return hasBooking;\n");
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
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : me.taxi }) ]);");
                return Q.npost(Taxi, 'findOne', [ ({ _id : me.taxi }) ]);
            }),
            Q().then(function() {
                console.log("return me;");
                return me;
            })
        ]).spread(function(taxi, readSelfAction) {
            console.log("taxi:" + taxi);console.log("readSelfAction:" + readSelfAction);
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
    console.log("this.hasBooking: " + JSON.stringify(this));
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : me.taxi }) ]);");
            return Q.npost(Taxi, 'findOne', [ ({ _id : me.taxi }) ]);
        }),
        Q().then(function() {
            console.log("return null;");
            return null;
        })
    ]).spread(function(taxi, valueSpecificationAction) {
        console.log("taxi:" + taxi);console.log("valueSpecificationAction:" + valueSpecificationAction);
        return !(taxi == valueSpecificationAction);
    });
};

driverSchema.methods.isPaymentDue = function () {
    console.log("this.paymentDue: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.getPendingCharges();");
        return me.getPendingCharges();
    }).then(function(pendingCharges) {
        console.log("return !(/*TBD*/isEmpty);\n");
        return !(/*TBD*/isEmpty);
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Charge, 'find', [ ({ driver : me._id }) ]);");
        return Q.npost(Charge, 'find', [ ({ driver : me._id }) ]);
    }).then(function(charges) {
        console.log("return charges.where({\n    $ne : [ \n        { status : null },\n        true\n    ]\n});\n");
        return charges.where({
            $ne : [ 
                { status : null },
                true
            ]
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Driver', driverSchema);
