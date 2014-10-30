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
            // isAsynchronous: false        
            console.log("return new Date()");
            return new Date();
        })()
    },
    estimatedReady : {
        type : Date,
        required : true,
        default : (function() {
            // isAsynchronous: false        
            console.log("return new Date(new Date() + 1)");
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
        // isAsynchronous: false        
        console.log("return this.estimatedReady == null || this.bookedOn == null || this.estimatedDays >= 0");
        return this.estimatedReady == null || this.bookedOn == null || this.estimatedDays >= 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return estimate > 0");
        return estimate > 0;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return estimate > 0');\n    return estimate > 0;\n}");
        throw "Precondition on newService was violated"
    }
    var s;
    console.log("s = new Service()");
    s = new Service();
    
    console.log("s.estimatedReady = new Date(s.bookedOn + estimate)");
    s.estimatedReady = new Date(s.bookedOn + estimate);
    
    console.log("s.description = description");
    s.description = description;
    
    console.log("s.car = carToService");
    s.car = carToService;
    
    console.log("return s");
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
    // isAsynchronous: false        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.assigned");
        return this.assigned;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.assigned');\n    return this.assigned;\n}");
        throw "Precondition on start was violated"
    }
    this.handleEvent('start');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Completes the service. 
 */
serviceSchema.methods.complete = function () {
    // isAsynchronous: false        
    this.handleEvent('complete');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.pending");
        return this.pending;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.pending');\n    return this.pending;\n}");
        throw "Precondition on assignTo was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.assigned");
        return !this.assigned;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.assigned');\n    return !this.assigned;\n}");
        throw "Precondition on assignTo was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return technician.working");
        return technician.working;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return technician.working');\n    return technician.working;\n}");
        throw "Precondition on assignTo was violated"
    }
    console.log("this.technician = technician");
    this.technician = technician;
    this.handleEvent('assignTo');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.pending");
        return this.pending;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.pending');\n    return this.pending;\n}");
        throw "Precondition on transfer was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.assigned");
        return this.assigned;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.assigned');\n    return this.assigned;\n}");
        throw "Precondition on transfer was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.technician == mechanic");
        return !this.technician == mechanic;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.technician == mechanic');\n    return !this.technician == mechanic;\n}");
        throw "Precondition on transfer was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return mechanic.working");
        return mechanic.working;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return mechanic.working');\n    return mechanic.working;\n}");
        throw "Precondition on transfer was violated"
    }
    console.log("this.technician = mechanic");
    this.technician = mechanic;
    this.handleEvent('transfer');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    // isAsynchronous: false        
    console.log("return services.where({ status : toMatch }).exec()");
    return services.where({ status : toMatch }).exec();
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.virtual('pending').get(function () {
    // isAsynchronous: false        
    console.log("return this.status == 'Booked' || this.status == 'InProgress'");
    return this.status == "Booked" || this.status == "InProgress";
});

serviceSchema.virtual('estimatedDays').get(function () {
    // isAsynchronous: false        
    console.log("return (this.estimatedReady - this.bookedOn) / (1000*60*60*24)");
    return (this.estimatedReady - this.bookedOn) / (1000*60*60*24);
});

serviceSchema.virtual('assigned').get(function () {
    // isAsynchronous: false        
    console.log("return !this.technician == null");
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
