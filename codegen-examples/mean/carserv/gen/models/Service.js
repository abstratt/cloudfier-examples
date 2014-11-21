var q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Model = require('./Model.js');
var AutoMechanic = require('./AutoMechanic.js');
var Car = require('./Car.js');
var Person = require('./Person.js');

// declare schema
var serviceSchema = new Schema({
    description : {
        type : String,
        required : true,
        default : null
    },
    bookedOn : {
        type : Date,
        default : (function() {
            return new Date();
        })()
    },
    estimatedReady : {
        type : Date,
        required : true,
        default : (function() {
            return new Date(new Date() + 1);
        })()
    },
    status : {
        type : String,
        enum : ["Booked", "InProgress", "Completed", "Cancelled"],
        default : "Booked"
    },
    technician : {
        type : Schema.Types.ObjectId,
        ref : "AutoMechanic"
    }
});
/*************************** INVARIANTS ***************************/

serviceSchema.path('estimatedReady').validate(
    function() {
        return this['estimatedReady'] == null || this['bookedOn'] == null || this['estimatedDays'] >= 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var s;
    return q().then(function() {
        return q().then(function() {
            s = new Service();
        });
    }).then(function() {
        return q().then(function() {
            s['estimatedReady'] = new Date(s['bookedOn'] + estimate);
        });
    }).then(function() {
        return q().then(function() {
            s['description'] = description;
        });
    }).then(function() {
        return q().then(function() {
            s['car'] = carToService;
        });
    }).then(function() {
        return q().then(function() {
            s.save();
            return q(s);
        });
    });
};

/**
 *  Cancels a service. 
 */
serviceSchema.methods.cancel = function () {
};

/**
 *  Starts the service. It can no longer be canceled. 
 */
serviceSchema.methods.start = function () {
    return q().then(function() {
        ;
    });
};

/**
 *  Completes the service. 
 */
serviceSchema.methods.complete = function () {
    return q().then(function() {
        ;
    });
};

/**
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    return q().then(function() {
        this['technician'] = technician;
    });
};

/**
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    return q().then(function() {
        this['technician'] = mechanic;
    });
};
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    return q().then(function() {
        return services.where({ status : toMatch }).exec();
    });
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.virtual('pending').get(function () {
    return this['status'] == "Booked" || this['status'] == "InProgress";
});

serviceSchema.virtual('estimatedDays').get(function () {
    return (this['estimatedReady'] - this['bookedOn']) / (1000*60*60*24);
});

serviceSchema.virtual('assigned').get(function () {
    return q().all([
        q().then(function() {
            return AutoMechanic.find({ _id : this.technician }).exec();
        }), q().then(function() {
            return null;
        })
    ]).spread(function(read_technician, valueSpecificationAction) {
        return !read_technician == valueSpecificationAction;
    });
});
/*************************** STATE MACHINE ********************/
serviceSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'cancel' :
            if (this.status == 'Booked') {
                this.status = 'Cancelled';
                return;
            }
            break;
        
        case 'start' :
            if (this.status == 'Booked') {
                this.status = 'InProgress';
                return;
            }
            break;
        
        case 'complete' :
            if (this.status == 'InProgress') {
                this.status = 'Completed';
                return;
            }
            break;
    }
};

serviceSchema.methods.cancel = function () {
    this.handleEvent('cancel');
};
serviceSchema.methods.start = function () {
    this.handleEvent('start');
};
serviceSchema.methods.complete = function () {
    this.handleEvent('complete');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Service', serviceSchema);
