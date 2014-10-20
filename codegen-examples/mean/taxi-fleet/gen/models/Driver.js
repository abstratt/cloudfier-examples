var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  Drivers that can book taxis. 
 */
// declare schema
var driverSchema = new Schema({
    name : {
        type : String,
        required : true
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
    // link taxi and drivers
    this.taxi = toRent;
    toRent.drivers.push(this);
};

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    this.taxi.drivers = null;
    this.taxi = null;
};
/*************************** DERIVED PROPERTIES ****************/

driverSchema.virtual('hasBooking').get(function () {
    return !(this.taxi == null);
});

driverSchema.virtual('paymentDue').get(function () {
    return !(isEmpty);
});
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    return this.charges.where('paid').ne(true);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Driver', driverSchema);
