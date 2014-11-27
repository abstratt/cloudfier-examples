var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Model = require('./Model.js');
var Rental = require('./Rental.js');

// declare schema
var carSchema = new Schema({
    plate : {
        type : String,
        "default" : null
    },
    price : {
        type : Number,
        "default" : 0
    },
    year : {
        type : Number,
        "default" : 0
    },
    color : {
        type : String,
        "default" : null
    },
    status : {
        type : String,
        enum : ["Available", "Rented", "UnderRepair"],
        "default" : "Available"
    },
    model : {
        type : Schema.Types.ObjectId,
        ref : "Model"
    },
    rentals : [{
        type : Schema.Types.ObjectId,
        ref : "Rental",
        "default" : []
    }]
});
/*************************** INVARIANTS ***************************/





/*************************** ACTIONS ***************************/

carSchema.methods.startRepair = function () {
    var me = this;
    return Q().then(function() {
        console.log("me.repairStarted();\nreturn Q();\n");
        me.repairStarted();
        return Q();
    }).then(function() {
        return me.save();
    });
};

carSchema.methods.finishRepair = function () {
    var me = this;
    return Q().then(function() {
        console.log("me.repairFinished();\nreturn Q();\n");
        me.repairFinished();
        return Q();
    }).then(function() {
        return me.save();
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('description').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);");
        return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);
    }).then(function(model) {
        console.log(model);
        console.log("return model['description'];");
        return model['description'];
    }).then(function(description) {
        console.log(description);
        console.log("return description + \" - \" + me['plate'];\n");
        return description + " - " + me['plate'];
    });
});

carSchema.virtual('available').get(function () {
    return this['status'] == "Available";
});

carSchema.virtual('underRepair').get(function () {
    return this['status'] == "UnderRepair";
});

carSchema.virtual('rented').get(function () {
    return this['status'] == "Rented";
});
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getCurrentRental = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Rental.currentForCar(me);");
        return Rental.currentForCar(me);
    }).then(function(currentForCar) {
        console.log(currentForCar);
        console.log("return currentForCar;\n");
        return currentForCar;
    });
};
/*************************** STATE MACHINE ********************/
carSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+"): "+ this);
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
    console.log("completed handleEvent("+ event+"): "+ this);
    
};

carSchema.methods.carRented = function () {
    this.handleEvent('CarRented');
};
carSchema.methods.repairStarted = function () {
    this.handleEvent('RepairStarted');
};
carSchema.methods.carReturned = function () {
    this.handleEvent('CarReturned');
};
carSchema.methods.repairFinished = function () {
    this.handleEvent('RepairFinished');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
