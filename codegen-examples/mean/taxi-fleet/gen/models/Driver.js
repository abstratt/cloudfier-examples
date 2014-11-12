var q = require("q");
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
        required : true,
        default : null
    },
    taxi : {
        type : Schema.Types.ObjectId,
        ref : "Taxi"
    },
    charges : [{
        type : Schema.Types.ObjectId,
        ref : "Charge"
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Book a taxi that is currently available 
 */
driverSchema.methods.book = function (toRent) {
    return q().then(function() {
        // link taxi and drivers
        this.taxi = toRent;
        toRent.drivers.push(this);
    });
};

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    return q().then(function() {
        return Taxi.find({ _id : this.taxi }).exec();
    }).then(function(taxi) {
        taxi.drivers = null;
        taxi = null;
    });
};
/*************************** DERIVED PROPERTIES ****************/

driverSchema.virtual('hasBooking').get(function () {
    return q().then(function() {
        return Taxi.find({ _id : this.taxi }).exec();
    }).then(function(taxi) {
        return !taxi == null;
    });
});

driverSchema.virtual('paymentDue').get(function () {
    return q().then(function() {
        return this.getPendingCharges();
    }).then(function(pendingCharges) {
        return !isEmpty;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    return q().then(function() {
        return Charge.findOne({ _id : this.charges }).exec();
    }).then(function(charges) {
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
