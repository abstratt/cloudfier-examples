    var EventEmitter = require('events').EventEmitter;        

    /**
     *  The vehicles that make up the fleet. 
     */
    var taxiSchema = new Schema({
        name : String,
        driverCount : Number,
        full : Boolean,
        booked : Boolean
    });
    
    /*************************** ACTIONS ***************************/
    
    /**
     *  Create charges for every driver 
     */
    taxiSchema.methods.charge = function (date) {
        <UNSUPPORTED: CallOperationAction> ;
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    taxiSchema.methods.getDriverCount = function () {
        return <UNSUPPORTED: CallOperationAction> ;
    };
    
    taxiSchema.methods.getFull = function () {
        return this.driverCount.greaterOrEquals(this.shift.shiftsPerDay);
    };
    
    taxiSchema.methods.getBooked = function () {
        return this.driverCount.greaterThan(UNKNOWN: 0);
    };
    
    taxiSchema.methods.getPendingCharges = function () {
        return Charge.byTaxi(this).where('paid').ne(true);
    };
    var Taxi = mongoose.model('Taxi', taxiSchema);
    Taxi.emitter = new EventEmitter();
