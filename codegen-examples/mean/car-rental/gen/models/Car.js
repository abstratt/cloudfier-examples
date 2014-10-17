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
        this.handleEvent('startRepair');
    };
    
    carSchema.methods.finishRepair = function () {
        this.repairFinished();
        this.handleEvent('finishRepair');
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
    carSchema.methods.handleEvent = function (event) {
        switch (event) {
            case 'CarRented' :
                if (this.status == 'Available') {
                    this.status = 'Rented';
                    return;
                }
                break;
            
            case 'RepairStarted' :
                if (this.status == 'Available') {
                    this.status = 'UnderRepair';
                    return;
                }
                break;
            
            case 'CarReturned' :
                if (this.status == 'Rented') {
                    this.status = 'Available';
                    return;
                }
                break;
            
            case 'RepairFinished' :
                if (this.status == 'UnderRepair') {
                    this.status = 'Available';
                    return;
                }
                break;
        }
    };
    
    
    var exports = module.exports = Car;
