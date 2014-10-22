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
    var precondition = function() {
        return <UNSUPPORTED: CallOperationAction> (exists);
    };
    if (!precondition.call(this)) {
        throw "Precondition on book was violated"
    }
    var precondition = function() {
        return !toRent.full;
    };
    if (!precondition.call(this)) {
        throw "Precondition on book was violated"
    }
    var precondition = function() {
        return !toRent == this.taxi;
    };
    if (!precondition.call(this)) {
        throw "Precondition on book was violated"
    }
    // link taxi and drivers
    this.taxi = toRent;
    toRent.drivers.push(this);
    return this.save();
};

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    var precondition = function() {
        return this.hasBooking;
    };
    if (!precondition.call(this)) {
        throw "Precondition on release was violated"
    }
    this.taxi.drivers = null;
    this.taxi = null;
    return this.save();
};
/*************************** DERIVED PROPERTIES ****************/

driverSchema.virtual('hasBooking').get(function () {
    return !this.taxi == null;
});

driverSchema.virtual('paymentDue').get(function () {
    return !isEmpty;
});
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    return this.charges.where('paid').ne(true);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Driver', driverSchema);
