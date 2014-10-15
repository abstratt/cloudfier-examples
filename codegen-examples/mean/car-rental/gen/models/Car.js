    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var carSchema = new Schema({
        description : {
            type : String
        },
        plate : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        available : {
            type : Boolean
        },
        year : {
            type : Number,
            required : true
        },
        color : {
            type : String,
            required : true
        },
        underRepair : {
            type : Boolean
        },
        rented : {
            type : Boolean
        },
        status : {
            type : String,
            enum : ["Available", "Rented", "UnderRepair"]
        },
        currentRental : {
            type : Schema.Types.ObjectId,
            ref : "Rental"
        },
        model : {
            type : Schema.Types.ObjectId,
            ref : "Model",
            required : true
        },
        rentals : [{
            type : Schema.Types.ObjectId,
            ref : "Rental"
        }]
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
    
    carSchema.methods.isAvailable = function () {
        return this.status == null;
    };
    
    carSchema.methods.getCurrentRental = function () {
        return Rental.currentForCar(this);
    };
    
    carSchema.methods.isUnderRepair = function () {
        return this.status == null;
    };
    
    carSchema.methods.isRented = function () {
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
