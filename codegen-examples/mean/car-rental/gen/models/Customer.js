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
    var rental;
    return q().then(function() {
        return q().then(function() {
            rental = new Rental();
        });
    }).then(function() {
        return q().then(function() {
            // link customer and rentals
            rental.customer = this;
            this.rentals.push(rental);
        });
    }).then(function() {
        return q().then(function() {
            // link car and rentals
            rental.car = car;
            car.rentals.push(rental);
        });
    }).then(function() {
        return q().then(function() {
            car.carRented();
        });
    });
};

customerSchema.methods.finishRental = function () {
    return q().then(function() {
        return q().then(function() {
            return this.getCurrentRental();
        }).then(function(read_currentRental) {
            return Car.find({ _id : read_currentRental.car }).exec();
        }).then(function(read_car) {
            read_car.carReturned();
        });
    }).then(function() {
        return q().then(function() {
            return this.getCurrentRental();
        }).then(function(read_currentRental) {
            read_currentRental.finish();
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    return q().all([
        q().then(function() {
            return this.getCurrentRental();
        }), q().then(function() {
            return null;
        })
    ]).spread(function(read_currentRental, valueSpecificationAction) {
        return !read_currentRental == valueSpecificationAction;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    return q().then(function() {
        return Rental.currentForCustomer(this);
    }).then(function(call_currentForCustomer) {
        return call_currentForCustomer;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
