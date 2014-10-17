var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  Drivers that can book taxis. 
 */
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
var Driver = mongoose.model('Driver', driverSchema);

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

driverSchema.method.getPendingCharges = function () {
    return this.charges.where('paid').ne(true);
};

var exports = module.exports = Driver;
