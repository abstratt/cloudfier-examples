    var EventEmitter = require('events').EventEmitter;        

    /**
     *  Drivers that can book taxis. 
     */
    var driverSchema = new Schema({
        name : String,
        hasBooking : Boolean,
        paymentDue : Boolean
    });
    
    /*************************** ACTIONS ***************************/
    
    /**
     *  Book a taxi that is currently available 
     */
    driverSchema.methods.book = function (toRent) {
        toRent.taxi = this;
    };
    
    /**
     *  Release a taxi that is currently booked 
     */
    driverSchema.methods.release = function () {
        delete this.taxi.taxi;
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    driverSchema.methods.getHasBooking = function () {
        return !(this.taxi == null);
    };
    
    driverSchema.methods.getPendingCharges = function () {
        return this.charges.where('paid').ne(true);
    };
    
    driverSchema.methods.getPaymentDue = function () {
        return !(<UNSUPPORTED: CallOperationAction> );
    };
    var Driver = mongoose.model('Driver', driverSchema);
    Driver.emitter = new EventEmitter();
