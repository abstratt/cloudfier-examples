    var EventEmitter = require('events').EventEmitter;        

    var customerSchema = new Schema({
        name : String,
        hasCurrentRental : Boolean
    });
    
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
    
    
    var Customer = mongoose.model('Customer', customerSchema);
    Customer.emitter = new EventEmitter();
