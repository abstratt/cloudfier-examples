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
        return this.estimatedReady == null || this.bookedOn == null || this.estimatedDays >= 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var precondition = function() {
        return estimate > 0;
    };
    if (!precondition.call(this)) {
        throw "Precondition on newService was violated"
    }
    var s;
    s = new Service();
    s.estimatedReady = new Date(s.bookedOn + estimate);
    s.description = description;
    s.car = carToService;
    return s;
};

/**
 *  Cancels a service. 
 */
serviceSchema.methods.cancel = function () {
    this.handleEvent('cancel');    
};

/**
 *  Starts the service. It can no longer be canceled. 
 */
serviceSchema.methods.start = function () {
    var precondition = function() {
        return this.assigned;
    };
    if (!precondition.call(this)) {
        throw "Precondition on start was violated"
    }
    this.handleEvent('start');
    return this.save();
};

/**
 *  Completes the service. 
 */
serviceSchema.methods.complete = function () {
    this.handleEvent('complete');
    return this.save();
};

/**
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    var precondition = function() {
        return this.pending;
    };
    if (!precondition.call(this)) {
        throw "Precondition on assignTo was violated"
    }
    var precondition = function() {
        return !this.assigned;
    };
    if (!precondition.call(this)) {
        throw "Precondition on assignTo was violated"
    }
    var precondition = function() {
        return technician.working;
    };
    if (!precondition.call(this)) {
        throw "Precondition on assignTo was violated"
    }
    this.technician = technician;
    this.handleEvent('assignTo');
    return this.save();
};

/**
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    var precondition = function() {
        return this.pending;
    };
    if (!precondition.call(this)) {
        throw "Precondition on transfer was violated"
    }
    var precondition = function() {
        return this.assigned;
    };
    if (!precondition.call(this)) {
        throw "Precondition on transfer was violated"
    }
    var precondition = function() {
        return !this.technician == mechanic;
    };
    if (!precondition.call(this)) {
        throw "Precondition on transfer was violated"
    }
    var precondition = function() {
        return mechanic.working;
    };
    if (!precondition.call(this)) {
        throw "Precondition on transfer was violated"
    }
    this.technician = mechanic;
    this.handleEvent('transfer');
    return this.save();
};
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    return services.where('status').eq(toMatch).exec();
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.virtual('pending').get(function () {
    return this.status == "Booked" || this.status == "InProgress";
});

serviceSchema.virtual('estimatedDays').get(function () {
    return (this.estimatedReady - this.bookedOn) / (1000*60*60*24);
});

serviceSchema.virtual('assigned').get(function () {
    return !this.technician == null;
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


// declare model on the schema
var exports = module.exports = mongoose.model('Service', serviceSchema);
