var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Model = require('./Model.js');
var Car = require('./Car.js');
var Rental = require('./Rental.js');

// declare schema
var customerSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    },
    rentals : [{
        type : Schema.Types.ObjectId,
        ref : "Rental"
    }]
});

/*************************** ACTIONS ***************************/

customerSchema.methods.rent = function (car) {
    var precondition = function() {
        return car.available;
    };
    if (!precondition.call(this)) {
        throw "Precondition on rent was violated"
    }
    var precondition = function() {
        return this.getCurrentRental() == null;
    };
    if (!precondition.call(this)) {
        throw "Precondition on rent was violated"
    }
    var rental = new Rental();
    // link customer and rentals
    rental.customer = this;
    this.rentals.push(rental);
    // link car and rentals
    rental.car = car;
    car.rentals.push(rental);
    /*car.carRented()*/;
    return this.save();
};

customerSchema.methods.finishRental = function () {
    var precondition = function() {
        return this.hasCurrentRental;
    };
    if (!precondition.call(this)) {
        throw "Precondition on finishRental was violated"
    }
    /*this.getCurrentRental().car.carReturned()*/;
    this.getCurrentRental().finish();
    return this.save();
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    return !(this.getCurrentRental() == null);
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    return Rental.currentForCustomer(this);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
