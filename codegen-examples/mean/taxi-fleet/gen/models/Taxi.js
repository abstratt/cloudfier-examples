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
//            taxiSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

/**
 *  Create charges for every driver 
 */
taxiSchema.methods.charge = function (date) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return me.isBooked();");
            return me.isBooked();
        }).then(function(booked) {
            console.log("return booked;\n");
            return booked;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Not booked, can't charge (on 'taxi_fleet::Taxi::charge')");
            error.context = 'taxi_fleet::Taxi::charge';
            error.constraint = '';
            error.description = 'Not booked, can't charge';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Driver, 'find', [ ({ taxi : me._id }) ]);");
            return Q.npost(Driver, 'find', [ ({ taxi : me._id }) ]);
        }).then(function(drivers) {
            console.log("/*TBD*/forEach;\n");
            /*TBD*/forEach;
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
    console.log("this.driverCount: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Driver, 'find', [ ({ taxi : me._id }) ]);");
        return Q.npost(Driver, 'find', [ ({ taxi : me._id }) ]);
    }).then(function(drivers) {
        console.log("return drivers.length;\n");
        return drivers.length;
    });
};

taxiSchema.methods.isFull = function () {
    console.log("this.full: " + JSON.stringify(this));
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Shift, 'findOne', [ ({ _id : me.shift }) ]);");
            return Q.npost(Shift, 'findOne', [ ({ _id : me.shift }) ]);
        }),
        Q().then(function() {
            console.log("return me.getDriverCount();");
            return me.getDriverCount();
        })
    ]).spread(function(shift, driverCount) {
        console.log("shift:" + shift);console.log("driverCount:" + driverCount);
        return driverCount >= shift.shiftsPerDay;
    });
};

taxiSchema.methods.isBooked = function () {
    console.log("this.booked: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.getDriverCount();");
        return me.getDriverCount();
    }).then(function(driverCount) {
        console.log("return driverCount > 0;\n");
        return driverCount > 0;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

taxiSchema.methods.getPendingCharges = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Charge.byTaxi(me);");
        return Charge.byTaxi(me);
    }).then(function(byTaxi) {
        console.log("return byTaxi.where({\n    $ne : [ \n        { status : null },\n        true\n    ]\n});\n");
        return byTaxi.where({
            $ne : [ 
                { status : null },
                true
            ]
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Taxi', taxiSchema);
