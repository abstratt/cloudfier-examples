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
        required : true,
        default : null
    },
    price : {
        type : Number,
        required : true,
        default : 0
    },
    year : {
        type : Number,
        required : true,
        default : 0
    },
    color : {
        type : String,
        required : true,
        default : null
    },
    status : {
        type : String,
        enum : ["Available", "Rented", "UnderRepair"],
        default : "Available"
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
/*************************** INVARIANTS ***************************/

carSchema.path('price').validate(
    function() {
        // isAsynchronous: false        
        console.log("return this.price >= 50.0");
        return this.price >= 50.0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('price').validate(
    function() {
        // isAsynchronous: false        
        console.log("return this.price <= 500.0");
        return this.price <= 500.0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('year').validate(
    function() {
        // isAsynchronous: false        
        console.log("return this.year > 1990");
        return this.year > 1990;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('year').validate(
    function() {
        // isAsynchronous: false        
        console.log("return this.year <= (new Date().getYear() + 1900)");
        return this.year <= (new Date().getYear() + 1900);
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

carSchema.methods.startRepair = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.status == 'Available'");
        return this.status == "Available";
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.status == 'Available'');\n    return this.status == 'Available';\n}");
        throw "Precondition on startRepair was violated"
    }
    console.log("/*this.repairStarted()*/");
    /*this.repairStarted()*/;
    this.handleEvent('startRepair');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

carSchema.methods.finishRepair = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.status == 'UnderRepair'");
        return this.status == "UnderRepair";
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.status == 'UnderRepair'');\n    return this.status == 'UnderRepair';\n}");
        throw "Precondition on finishRepair was violated"
    }
    console.log("/*this.repairFinished()*/");
    /*this.repairFinished()*/;
    this.handleEvent('finishRepair');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('description').get(function () {
    // isAsynchronous: false        
    console.log("return this.model.description + ' - ' + this.plate");
    return this.model.description + " - " + this.plate;
});

carSchema.virtual('available').get(function () {
    // isAsynchronous: false        
    console.log("return this.status == 'Available'");
    return this.status == "Available";
});

carSchema.virtual('underRepair').get(function () {
    // isAsynchronous: false        
    console.log("return this.status == 'UnderRepair'");
    return this.status == "UnderRepair";
});

carSchema.virtual('rented').get(function () {
    // isAsynchronous: false        
    console.log("return this.status == 'Rented'");
    return this.status == "Rented";
});
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getCurrentRental = function () {
    // isAsynchronous: true        
    console.log("return Rental.currentForCar(this)");
    return Rental.currentForCar(this);
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
