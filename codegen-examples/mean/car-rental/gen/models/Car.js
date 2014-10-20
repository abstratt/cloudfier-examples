var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var carSchema = new Schema({
    plate : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    year : {
        type : Number,
        required : true
    },
    color : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Available", "Rented", "UnderRepair"]
    },
    model : {
        type : Schema.Types.ObjectId,
        ref : "Model"
    },
    rentals : [{
        type : Schema.Types.ObjectId,
        ref : "Rental"
    }]
});

/*************************** ACTIONS ***************************/

carSchema.methods.startRepair = function () {
    /*this.repairStarted()*/;
    this.handleEvent('startRepair');
};

carSchema.methods.finishRepair = function () {
    /*this.repairFinished()*/;
    this.handleEvent('finishRepair');
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('description').get(function () {
    return this.model.description + " - " + this.plate;
});

carSchema.virtual('available').get(function () {
    return this.status == null;
});

carSchema.virtual('underRepair').get(function () {
    return this.status == null;
});

carSchema.virtual('rented').get(function () {
    return this.status == null;
});
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getCurrentRental = function () {
    return require('./Rental.js').currentForCar(this);
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


// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
