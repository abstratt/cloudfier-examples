    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    /**
     *  The vehicles that make up the fleet. 
     */
    var taxiSchema = new Schema({
        name : {
            type : String,
            required : true
        },
        driverCount : {
            type : Number
        },
        full : {
            type : Boolean
        },
        booked : {
            type : Boolean
        },
        shift : {
            type : Schema.Types.ObjectId,
            ref : "Shift",
            required : true
        },
        drivers : [{
            type : Schema.Types.ObjectId,
            ref : "Driver"
        }],
        pendingCharges : [{
            type : Schema.Types.ObjectId,
            ref : "Charge"
        }]
    });
    var Taxi = mongoose.model('Taxi', taxiSchema);
    Taxi.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    /**
     *  Create charges for every driver 
     */
    taxiSchema.methods.charge = function (date) {
        forEach;
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    taxiSchema.methods.getDriverCount = function () {
        return count;
    };
    
    taxiSchema.methods.isFull = function () {
        return this.driverCount >= this.shift.shiftsPerDay;
    };
    
    taxiSchema.methods.isBooked = function () {
        return this.driverCount > 0;
    };
    
    taxiSchema.methods.getPendingCharges = function () {
        return Charge.byTaxi(this).where('paid').ne(true);
    };
    
    var exports = module.exports = Taxi;
