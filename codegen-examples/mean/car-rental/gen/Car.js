    var EventEmitter = require('events').EventEmitter;        

    var carSchema = new Schema({
        description : String,
        plate : String,
        price : Number,
        available : Boolean,
        year : Number,
        color : String,
        underRepair : Boolean,
        rented : Boolean,
        status : Status
    });
    
    /*************************** ACTIONS ***************************/
    
    carSchema.methods.startRepair = function () {
        this.repairStarted();
    };
    
    carSchema.methods.finishRepair = function () {
        this.repairFinished();
    };
    
    
    /*************************** DERIVED PROPERTIES ****************/
    
    carSchema.methods.getDescription = function () {
        return this.model.description + " - " + this.plate;
    };
    
    carSchema.methods.getAvailable = function () {
        return this.status == null;
    };
    
    carSchema.methods.getCurrentRental = function () {
        return Rental.currentForCar(this);
    };
    
    carSchema.methods.getUnderRepair = function () {
        return this.status == null;
    };
    
    carSchema.methods.getRented = function () {
        return this.status == null;
    };
    
    
    var Car = mongoose.model('Car', carSchema);
    Car.emitter = new EventEmitter();
