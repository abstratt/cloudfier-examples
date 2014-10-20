var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var customerSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    rentals : [{
        type : Schema.Types.ObjectId,
        ref : "Rental"
    }]
});

/*************************** ACTIONS ***************************/

customerSchema.methods.rent = function (car) {
    var rental = new require('./Rental.js') ();
    // link customer and rentals
    rental.customer = this;
    this.rentals.push(rental);
    // link car and rentals
    rental.car = car;
    car.rentals.push(rental);
    /*car.carRented()*/;
};

customerSchema.methods.finishRental = function () {
    /*this.getCurrentRental().car.carReturned()*/;
    this.getCurrentRental().finish();
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    return !(this.getCurrentRental() == null);
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    return require('./Rental.js').currentForCustomer(this);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
