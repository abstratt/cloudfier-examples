    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;

    var carSchema = new Schema({
        description : String,
        plate : String,
        price : Number,
        available : Boolean,
        year : Number,
        color : String,
        underRepair : Boolean,
        rented : Boolean,
        status : String,
        currentRental : { type: Schema.Types.ObjectId, ref: 'Rental' },
        model : { type: Schema.Types.ObjectId, ref: 'Model' },
        rentals : [{ type: Schema.Types.ObjectId, ref: 'Rental' }]
    });
    var Car = mongoose.model('Car', carSchema);
    Car.emitter = new EventEmitter();
    
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
    /*************************** STATE MACHINE ********************/
    Car.emitter.on('CarRented', function () {
        if (this.status == 'Available') {
            this.status = 'Rented';
            return;
        }
    });     
    
    Car.emitter.on('RepairStarted', function () {
        if (this.status == 'Available') {
            this.status = 'UnderRepair';
            return;
        }
    });     
    
    Car.emitter.on('CarReturned', function () {
        if (this.status == 'Rented') {
            this.status = 'Available';
            return;
        }
    });     
    
    Car.emitter.on('RepairFinished', function () {
        if (this.status == 'UnderRepair') {
            this.status = 'Available';
            return;
        }
    });     
    
    
    var exports = module.exports = Car;
