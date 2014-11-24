var Q = require("q");
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
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("rental = new Rental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            rental = new Rental();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("// link customer and rentals<NL>rental.customer = me;<NL>me.rentals.push(rental);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            // link customer and rentals
            rental.customer = me;
            me.rentals.push(rental);
        });
    }).then(function() {
        return Q.when(function() {
            console.log("// link car and rentals<NL>rental.car = car;<NL>car.rentals.push(rental);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            // link car and rentals
            rental.car = car;
            car.rentals.push(rental);
        });
    }).then(function() {
        return Q.when(function() {
            console.log("car.carRented()<NL>return Q.when(null);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            car.carRented()
            return Q.when(null);
        });
    });
};

customerSchema.methods.finishRental = function () {
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("return me.getCurrentRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getCurrentRental();
        }).then(function(read_currentRental) {
            return Car.findOne({ _id : read_currentRental.car }).exec();
        }).then(function(read_car) {
            read_car.carReturned()
            return Q.when(null);
        });
    }).then(function() {
        return Q.when(function() {
            console.log("return me.getCurrentRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getCurrentRental();
        }).then(function(read_currentRental) {
            read_currentRental.finish();
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return me.getCurrentRental();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getCurrentRental();
        }),
        Q.when(function() {
            console.log("return null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return null;
        })
    ]).spread(function(read_currentRental, valueSpecificationAction) {
        return !read_currentRental == valueSpecificationAction;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    var me = this;
    return Q.when(function() {
        console.log("return Rental.currentForCustomer(me);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Rental.currentForCustomer(me);
    }).then(function(call_currentForCustomer) {
        return call_currentForCustomer;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
