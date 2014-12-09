var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : 500.0
    },
    year : {
        type : Number,
        "default" : (function() {
            /*sync*/return (new Date().getYear() + 1900);
        })()
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
//            carSchema.set('toObject', { getters: true });

/*************************** INVARIANTS ***************************/

carSchema.path('price').validate(
    function() {
        /*sync*/return  this.price >= 50.0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('price').validate(
    function() {
        /*sync*/return  this.price <= 500.0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('year').validate(
    function() {
        /*sync*/return  this.year > 1990;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

carSchema.path('year').validate(
    function() {
        /*sync*/return  this.year <= (new Date().getYear() + 1900);
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

carSchema.methods.startRepair = function () {
    var me = this;
    return Q().then(function() {
        /*sync*/return me.status == "Available";
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: must_be_available (on 'car_rental::Car::startRepair')");
            error.context = 'car_rental::Car::startRepair';
            error.constraint = 'must_be_available';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return me.repairStarted();;
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
    });
};

carSchema.methods.finishRepair = function () {
    var me = this;
    return Q().then(function() {
        /*sync*/return me.status == "UnderRepair";
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: must_be_under_repair (on 'car_rental::Car::finishRepair')");
            error.context = 'car_rental::Car::finishRepair';
            error.constraint = 'must_be_under_repair';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return me.repairFinished();;
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.methods.getDescription = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);
    }).then(function(model) {
        return model.getDescription();
    }).then(function(description) {
        return description + " - " + me.plate;
    });
};

carSchema.methods.isAvailable = function () {
    /*sync*/return  this.status == "Available";
};

carSchema.methods.isUnderRepair = function () {
    /*sync*/return  this.status == "UnderRepair";
};

carSchema.methods.isRented = function () {
    /*sync*/return  this.status == "Rented";
};
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getCurrentRental = function () {
    var me = this;
    return Q().then(function() {
        return Rental.currentForCar(me);
    }).then(function(currentForCar) {
        return currentForCar;
    });
};
/*************************** STATE MACHINE ********************/
carSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'CarRented' :
            if (this.status == 'Available') {
                this.status = 'Rented';
                break;
            }
            break;
        
        case 'RepairStarted' :
            if (this.status == 'Available') {
                this.status = 'Rented';
                break;
            }
            break;
        
        case 'CarReturned' :
            if (this.status == 'Rented') {
                this.status = 'Available';
                break;
            }
            break;
        
        case 'RepairFinished' :
            if (this.status == 'UnderRepair') {
                this.status = 'Available';
                break;
            }
            break;
    }
    return Q.npost( this, 'save', [  ]);
};

carSchema.methods.carRented = function () {
    return this.handleEvent('CarRented');
};
carSchema.methods.repairStarted = function () {
    return this.handleEvent('RepairStarted');
};
carSchema.methods.carReturned = function () {
    return this.handleEvent('CarReturned');
};
carSchema.methods.repairFinished = function () {
    return this.handleEvent('RepairFinished');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
