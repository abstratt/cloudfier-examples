var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Model = require('./Model.js');
var Car = require('./Car.js');
var Service = require('./Service.js');
var Person = require('./Person.js');

// declare schema
var autoMechanicSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        default : null
    },
    lastName : {
        type : String,
        required : true,
        default : null
    },
    username : {
        type : String,
        default : null
    },
    status : {
        type : String,
        enum : ["Working", "Vacation", "Retired"],
        default : "Working"
    },
    services : [{
        type : Schema.Types.ObjectId,
        ref : "Service"
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Unassigns any work scheduled. Does not affect work in progress. 
 */
autoMechanicSchema.methods.unassign = function () {
    // isAsynchronous: false        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.workScheduled");
        return this.workScheduled;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.workScheduled');\n    return this.workScheduled;\n}");
        throw "Precondition on unassign was violated"
    }
    console.log("this.doUnassign()");
    this.doUnassign();
    this.handleEvent('unassign');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Puts employee into vacation. Unassigns any work scheduled. 
 */
autoMechanicSchema.methods.beginVacation = function () {
    // isAsynchronous: false        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.workInProgress");
        return !this.workInProgress;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.workInProgress');\n    return !this.workInProgress;\n}");
        throw "Precondition on beginVacation was violated"
    }
    this.handleEvent('beginVacation');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Brings the employee back from vacation. Employee can be assigned work again. 
 */
autoMechanicSchema.methods.endVacation = function () {
    this.handleEvent('endVacation');    
};

autoMechanicSchema.methods.retire = function () {
    // isAsynchronous: false        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.workInProgress");
        return !this.workInProgress;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.workInProgress');\n    return !this.workInProgress;\n}");
        throw "Precondition on retire was violated"
    }
    this.handleEvent('retire');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    // isAsynchronous: false        
    console.log("return this.firstName + ' ' + this.lastName");
    return this.firstName + " " + this.lastName;
});

autoMechanicSchema.virtual('working').get(function () {
    // isAsynchronous: false        
    console.log("return this.status == 'Working'");
    return this.status == "Working";
});

autoMechanicSchema.virtual('workInProgress').get(function () {
    // isAsynchronous: false        
    console.log("return !isEmpty");
    return !isEmpty;
});

autoMechanicSchema.virtual('workScheduled').get(function () {
    // isAsynchronous: false        
    console.log("return !isEmpty");
    return !isEmpty;
});
/*************************** DERIVED RELATIONSHIPS ****************/

/**
 *  Services currently in progress by this worker. 
 */
autoMechanicSchema.methods.getCurrentServices = function () {
    // isAsynchronous: false        
    console.log("return Service.byStatus(this.services, 'InProgress')");
    return Service.byStatus(this.services, "InProgress");
};

/**
 *  Services assigned to this worker but not yet started. 
 */
autoMechanicSchema.methods.getUpcomingServices = function () {
    // isAsynchronous: false        
    console.log("return Service.byStatus(this.services, 'Booked')");
    return Service.byStatus(this.services, "Booked");
};
/*************************** PRIVATE OPS ***********************/

autoMechanicSchema.methods.doUnassign = function () {
    // isAsynchronous: false        
    console.log("forEach");
    forEach;
};
/*************************** STATE MACHINE ********************/
autoMechanicSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'beginVacation' :
            if (this.status == 'Working') {
                this.status = 'Vacation';
                return;
            }
            break;
        
        case 'retire' :
            if (this.status == 'Working') {
                this.status = 'Retired';
                return;
            }
            break;
        
        case 'endVacation' :
            if (this.status == 'Vacation') {
                this.status = 'Working';
                return;
            }
            break;
    }
};


// declare model on the schema
var exports = module.exports = mongoose.model('AutoMechanic', autoMechanicSchema);
