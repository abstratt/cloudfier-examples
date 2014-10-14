    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;

    var customerSchema = new Schema({
        name : String,
        hasCurrentRental : Boolean,
        rentals : [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
        currentRental : { type: Schema.Types.ObjectId, ref: 'Rental' }
    });
    var Customer = mongoose.model('Customer', customerSchema);
    Customer.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    customerSchema.methods.rent = function (car) {
        rental = new Rental();
        this.customer = rental;
        car.car = rental;
        rental.customer = this;
        car.carRented();
    };
    
    customerSchema.methods.finishRental = function () {
        this.currentRental.car.carReturned();
        this.currentRental.finish();
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    customerSchema.methods.getHasCurrentRental = function () {
        return !(this.currentRental == null);
    };
    
    customerSchema.methods.getCurrentRental = function () {
        return Rental.currentForCustomer(this);
    };
    
    var exports = module.exports = Customer;
