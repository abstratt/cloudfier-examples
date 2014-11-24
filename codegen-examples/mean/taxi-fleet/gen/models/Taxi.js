var Q = require("q");
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
    var me = this;
    return Q.when(function() {
        console.log("return Driver.find({ taxi : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Driver.find({ taxi : me._id }).exec();
    }).then(function(read_drivers) {
        /*TBD*/forEach;
    });
};
/*************************** DERIVED PROPERTIES ****************/

taxiSchema.virtual('driverCount').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return Driver.find({ taxi : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Driver.find({ taxi : me._id }).exec();
    }).then(function(read_drivers) {
        return /*TBD*/count;
    });
});

taxiSchema.virtual('full').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Shift.findOne({ _id : me.shift }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Shift.findOne({ _id : me.shift }).exec();
        }),
        Q.when(function() {
            console.log("return me['driverCount'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me['driverCount'];
        })
    ]).spread(function(read_shift, read_driverCount) {
        return read_driverCount >= read_shift['shiftsPerDay'];
    });
});

taxiSchema.virtual('booked').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return me['driverCount'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me['driverCount'];
    }).then(function(read_driverCount) {
        return read_driverCount > 0;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

taxiSchema.methods.getPendingCharges = function () {
    var me = this;
    return Q.when(function() {
        console.log("return Charge.byTaxi(me);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Charge.byTaxi(me);
    }).then(function(call_byTaxi) {
        return call_byTaxi.where({
            $ne : [ 
                { 'paid' : true },
                true
            ]
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Taxi', taxiSchema);
