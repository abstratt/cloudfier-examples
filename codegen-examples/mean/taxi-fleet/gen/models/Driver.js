var Q = require("q");
var mongoose = require('mongoose');    
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
        console.log("console.log(\"This: \");\nconsole.log(toRent);\nconsole.log(\"That: \");\nconsole.log(me);\nme.taxi = toRent._id;\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(toRent);\ntoRent.drivers.push(me._id);\n");
        console.log("This: ");
        console.log(toRent);
        console.log("That: ");
        console.log(me);
        me.taxi = toRent._id;
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(toRent);
        toRent.drivers.push(me._id);
    }).then(function() {
        return me.save();
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
        return me.save();
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
        console.log("return charges.where({\n    $ne : [ \n        { 'paid' : true },\n        true\n    ]\n});\n");
        return charges.where({
            $ne : [ 
                { 'paid' : true },
                true
            ]
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Driver', driverSchema);
