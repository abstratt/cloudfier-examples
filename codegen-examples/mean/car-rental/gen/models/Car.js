var q = require("q");
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
        return this['price'] >= 50.0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('price').validate(
    function() {
        return this['price'] <= 500.0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('year').validate(
    function() {
        return this['year'] > 1990;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('year').validate(
    function() {
        return this['year'] <= (new Date().getYear() + 1900);
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

carSchema.methods.startRepair = function () {
    return q().then(function() {
        this.repairStarted();
    });
};

carSchema.methods.finishRepair = function () {
    return q().then(function() {
        this.repairFinished();
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('description').get(function () {
    return q().then(function() {
        return Model.findOne({ _id : this.model }).exec();
    }).then(function(read_model) {
        return read_model['description'];
    }).then(function(read_description) {
        return read_description + " - " + this['plate'];
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
    return q().then(function() {
        return Rental.currentForCar(this);
    }).then(function(call_currentForCar) {
        return call_currentForCar;
    });
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
