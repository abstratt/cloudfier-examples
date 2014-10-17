    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    /**
     *  Drivers that can book taxis. 
     */
    var driverSchema = new Schema({
        name : {
            type : String,
            required : true
        },
        hasBooking : {
            type : Boolean
        },
        paymentDue : {
            type : Boolean
        },
        taxi : {
            type : Schema.Types.ObjectId,
            ref : "Taxi"
        },
        charges : [{
            type : Schema.Types.ObjectId,
            ref : "Charge"
        }],
        pendingCharges : [{
            type : Schema.Types.ObjectId,
            ref : "Charge"
        }]
    });
    var Driver = mongoose.model('Driver', driverSchema);
    Driver.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    /**
     *  Book a taxi that is currently available 
     */
    driverSchema.methods.book = function (toRent) {
        toRent.taxi = this;
        this.handleEvent('book');
    };
    
    /**
     *  Release a taxi that is currently booked 
     */
    driverSchema.methods.release = function () {
        this.taxi.drivers = null;
        this.taxi = null;
        this.handleEvent('release');
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    driverSchema.methods.isHasBooking = function () {
        return !(this.taxi == null);
    };
    
    driverSchema.methods.getPendingCharges = function () {
        return this.charges.where('paid').ne(true);
    };
    
    driverSchema.methods.isPaymentDue = function () {
        return !(isEmpty);
    };
    
    var exports = module.exports = Driver;
