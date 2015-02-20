var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Shift = require('./Shift.js');
var Driver = require('./Driver.js');
var Charge = require('./Charge.js');

/**
 *  The vehicles that make up the fleet. 
 */
// declare schema
var taxiSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    shift : {
        type : Schema.Types.ObjectId,
        ref : "Shift",
        required : true
    },
    drivers : [{
        type : Schema.Types.ObjectId,
        ref : "Driver",
        "default" : []
    }]
});


/*************************** ACTIONS ***************************/

/**
 *  Create charges for every driver 
 */
taxiSchema.methods.charge = function (date) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isBooked();
        }).then(function(booked) {
            return booked;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Not booked, can't charge (on 'taxi_fleet::Taxi::charge')");
            error.context = 'taxi_fleet::Taxi::charge';
            error.constraint = '';
            error.description = 'Not booked, can\'t charge';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q().then(function() {
            return Q.npost(require('./Driver.js'), 'find', [ ({ taxi : me._id }) ]);
        }).then(function(drivers) {
            return /*TBD*/forEach;
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

taxiSchema.methods.getDriverCount = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Driver.js'), 'find', [ ({ taxi : me._id }) ]);
    }).then(function(drivers) {
        return drivers.length;
    }).then(function(sizeResult) {
        return sizeResult;
    });
};

taxiSchema.methods.isFull = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Shift.js'), 'findOne', [ ({ _id : me.shift }) ]);
        }),
        Q().then(function() {
            return me.getDriverCount();
        })
    ]).spread(function(shift, driverCount) {
        return driverCount >= shift.shiftsPerDay;
    });
};

taxiSchema.methods.isBooked = function () {
    var me = this;
    return Q().then(function() {
        return me.getDriverCount();
    }).then(function(driverCount) {
        return driverCount > 0;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

taxiSchema.methods.getPendingCharges = function () {
    var me = this;
    return Q().then(function() {
        return require('./Charge.js').byTaxi(me);
    }).then(function(byTaxiResult) {
        return byTaxiResult.where({
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
var exports = module.exports = mongoose.model('Taxi', taxiSchema);
