var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

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
var Customer = mongoose.model('Customer', customerSchema);

/*************************** ACTIONS ***************************/

customerSchema.methods.rent = function (car) {
    var rental = new Rental();
    // link customer and rentals
    rental.customer = this;
    this.rentals.push(rental);
    // link car and rentals
    rental.car = car;
    car.rentals.push(rental);
    car.carRented();
};

customerSchema.methods.finishRental = function () {
    this.currentRental.car.carReturned();
    this.currentRental.finish();
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    return !(this.currentRental == null);
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.method.getCurrentRental = function () {
    return Rental.currentForCustomer(this);
};

var exports = module.exports = Customer;
