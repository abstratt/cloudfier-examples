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
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
};
/*************************** DERIVED PROPERTIES ****************/

taxiSchema.virtual('driverCount').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Driver, 'find', [ ({ taxi : me._id }) ]);");
        return Q.npost(Driver, 'find', [ ({ taxi : me._id }) ]);
    }).then(function(drivers) {
        console.log("return drivers.length;\n");
        return drivers.length;
    });
});

taxiSchema.virtual('full').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Shift, 'findOne', [ ({ _id : me.shift }) ]);");
            return Q.npost(Shift, 'findOne', [ ({ _id : me.shift }) ]);
        }),
        Q().then(function() {
            console.log("return me.driverCount;");
            return me.driverCount;
        })
    ]).spread(function(shift, driverCount) {
        return driverCount >= shift.shiftsPerDay;
    });
});

taxiSchema.virtual('booked').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.driverCount;");
        return me.driverCount;
    }).then(function(driverCount) {
        console.log("return driverCount > 0;\n");
        return driverCount > 0;
    });
});
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
