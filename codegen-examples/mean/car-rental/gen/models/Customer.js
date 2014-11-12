var q = require("q");
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
    return q().then(function() {
        var rental;
        rental = new Rental();
        // link customer and rentals
        rental.customer = this;
        this.rentals.push(rental);
        // link car and rentals
        rental.car = car;
        car.rentals.push(rental);
        car.carRented();
    });
};

customerSchema.methods.finishRental = function () {
    return q().all([q().then(function() {
        return this.getCurrentRental();
    }).then(function(currentRental) {
        return Car.find({ _id : currentRental.car }).exec();
    }), q().then(function() {
        return this.getCurrentRental();
    })]).spread(function(car, currentRental) {
        car.carReturned();
        currentRental.finish();
    });
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    return q().then(function() {
        return this.getCurrentRental();
    }).then(function(currentRental) {
        return !currentRental == null;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    return q().then(function() {
        return Rental.currentForCustomer(this);
    }).then(function(currentForCustomer) {
        return currentForCustomer;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
