var q = require("q");
var mongoose = require('mongoose');    
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
        required : true,
        default : null
    },
    shift : {
        type : Schema.Types.ObjectId,
        ref : "Shift",
        required : true
    },
    drivers : [{
        type : Schema.Types.ObjectId,
        ref : "Driver"
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Create charges for every driver 
 */
taxiSchema.methods.charge = function (date) {
    return q().then(function() {
        return Driver.findOne({ _id : this.drivers }).exec();
    }).then(function(drivers) {
        forEach;
    });
};
/*************************** DERIVED PROPERTIES ****************/

taxiSchema.virtual('driverCount').get(function () {
    return q().then(function() {
        return Driver.findOne({ _id : this.drivers }).exec();
    }).then(function(drivers) {
        return count;
    });
});

taxiSchema.virtual('full').get(function () {
    return q().all([q().then(function() {
        return Shift.findOne({ _id : this.shift }).exec();
    }), q().then(function() {
        return this['driverCount'];
    })]).spread(function(shift, driverCount) {
        return driverCount >= shift['shiftsPerDay'];
    });
});

taxiSchema.virtual('booked').get(function () {
    return q().then(function() {
        return this['driverCount'];
    }).then(function(driverCount) {
        return driverCount > 0;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

taxiSchema.methods.getPendingCharges = function () {
    return q().then(function() {
        return Charge.byTaxi(this);
    }).then(function(byTaxi) {
        return byTaxi.where({
            $ne : [ 
                { 'paid' : true },
                true
            ]
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Taxi', taxiSchema);
