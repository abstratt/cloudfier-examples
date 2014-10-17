var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  The vehicles that make up the fleet. 
 */
var taxiSchema = new Schema({
    name : {
        type : String,
        required : true
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
var Taxi = mongoose.model('Taxi', taxiSchema);

/*************************** ACTIONS ***************************/

/**
 *  Create charges for every driver 
 */
taxiSchema.methods.charge = function (date) {
    forEach;
};
/*************************** DERIVED PROPERTIES ****************/

taxiSchema.virtual('driverCount').get(function () {
    return count;
});

taxiSchema.virtual('full').get(function () {
    return this.driverCount >= this.shift.shiftsPerDay;
});

taxiSchema.virtual('booked').get(function () {
    return this.driverCount > 0;
});
/*************************** DERIVED RELATIONSHIPS ****************/

taxiSchema.method.getPendingCharges = function () {
    return Charge.byTaxi(this).where('paid').ne(true);
};

var exports = module.exports = Taxi;
