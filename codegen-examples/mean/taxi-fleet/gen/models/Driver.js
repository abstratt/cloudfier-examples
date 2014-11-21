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
    return q(/*leaf*/).then(function() {
        // link taxi and drivers
        this.taxi = toRent;
        toRent.drivers.push(this);
    });
};

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    return q(/*parallel*/).all([
        q(/*leaf*/).then(function() {
            return Taxi.find({ _id : this.taxi }).exec();
        }), q(/*leaf*/).then(function() {
            return this;
        })
    ]).spread(function(read_taxi, readSelfAction) {
        read_taxi.drivers = null;
        read_taxi = null;
    });
};
/*************************** DERIVED PROPERTIES ****************/

driverSchema.virtual('hasBooking').get(function () {
    return q(/*parallel*/).all([
        q(/*leaf*/).then(function() {
            return Taxi.find({ _id : this.taxi }).exec();
        }), q(/*leaf*/).then(function() {
            return null;
        })
    ]).spread(function(read_taxi, valueSpecificationAction) {
        return !read_taxi == valueSpecificationAction;
    });
});

driverSchema.virtual('paymentDue').get(function () {
    return q(/*leaf*/).then(function() {
        return this.getPendingCharges();
    }).then(function(/*singleChild*/read_pendingCharges) {
        return !/*TBD*/isEmpty;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    return q(/*leaf*/).then(function() {
        return Charge.findOne({ _id : this.charges }).exec();
    }).then(function(/*singleChild*/read_charges) {
        return read_charges.where({
            $ne : [ 
                { 'paid' : true },
                true
            ]
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Driver', driverSchema);
