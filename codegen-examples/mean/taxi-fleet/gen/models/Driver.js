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
        console.log("me.taxi = toRent._id;\ntoRent.drivers.push(me._id);\n");
        me.taxi = toRent._id;
        toRent.drivers.push(me._id);
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]);
    });
};

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    var me = this;
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
        taxi.drivers = null;
        taxi = null;
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]);
    });
};
/*************************** DERIVED PROPERTIES ****************/

driverSchema.virtual('hasBooking').get(function () {
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
        return !taxi == valueSpecificationAction;
    });
});

driverSchema.virtual('paymentDue').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.getPendingCharges();");
        return me.getPendingCharges();
    }).then(function(pendingCharges) {
        console.log(pendingCharges);
        console.log("return !/*TBD*/isEmpty;\n");
        return !/*TBD*/isEmpty;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Charge, 'find', [ ({ driver : me._id }) ]);");
        return Q.npost(Charge, 'find', [ ({ driver : me._id }) ]);
    }).then(function(charges) {
        console.log(charges);
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
