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
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return car.available");
        return car.available;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return car.available');\n    return car.available;\n}");
        throw "Precondition on rent was violated"
    }
    var precondition = function() {
        // isAsynchronous: true        
        console.log("return this.getCurrentRental() == null");
        return this.getCurrentRental() == null;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: true        \n    console.log('return this.getCurrentRental() == null');\n    return this.getCurrentRental() == null;\n}");
        throw "Precondition on rent was violated"
    }
    var rental;
    console.log("rental = new Rental()");
    rental = new Rental();
    
    console.log("// link customer and rentalsnrental.customer = this;nthis.rentals.push(rental)");
    // link customer and rentals
    rental.customer = this;
    this.rentals.push(rental);
    
    console.log("// link car and rentalsnrental.car = car;ncar.rentals.push(rental)");
    // link car and rentals
    rental.car = car;
    car.rentals.push(rental);
    
    console.log("/*car.carRented()*/");
    /*car.carRented()*/;
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

customerSchema.methods.finishRental = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: true        
        console.log("return this.hasCurrentRental");
        return this.hasCurrentRental;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: true        \n    console.log('return this.hasCurrentRental');\n    return this.hasCurrentRental;\n}");
        throw "Precondition on finishRental was violated"
    }
    console.log("/*this.getCurrentRental().car.carReturned()*/");
    /*this.getCurrentRental().car.carReturned()*/;
    
    console.log("this.getCurrentRental().finish()");
    this.getCurrentRental().finish();
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    // isAsynchronous: true        
    console.log("return !this.getCurrentRental() == null");
    return !this.getCurrentRental() == null;
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    // isAsynchronous: true        
    console.log("return Rental.currentForCustomer(this)");
    return Rental.currentForCustomer(this);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
