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
    var me = this;
    return Q.when(function() {
        console.log("// link taxi and drivers<NL>me.taxi = toRent;<NL>toRent.drivers.push(me);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        // link taxi and drivers
        me.taxi = toRent;
        toRent.drivers.push(me);
    });
};

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Taxi.findOne({ _id : me.taxi }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Taxi.findOne({ _id : me.taxi }).exec();
        }),
        Q.when(function() {
            console.log("return me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me;
        })
    ]).spread(function(read_taxi, readSelfAction) {
        read_taxi.drivers = null;
        read_taxi = null;
    });
};
/*************************** DERIVED PROPERTIES ****************/

driverSchema.virtual('hasBooking').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Taxi.findOne({ _id : me.taxi }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Taxi.findOne({ _id : me.taxi }).exec();
        }),
        Q.when(function() {
            console.log("return null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return null;
        })
    ]).spread(function(read_taxi, valueSpecificationAction) {
        return !read_taxi == valueSpecificationAction;
    });
});

driverSchema.virtual('paymentDue').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.getPendingCharges();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.getPendingCharges();
    }).then(function(read_pendingCharges) {
        return !/*TBD*/isEmpty;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    var me = this;
    return Q.when(function() {
        console.log("return Charge.find({ driver : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Charge.find({ driver : me._id }).exec();
    }).then(function(read_charges) {
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
