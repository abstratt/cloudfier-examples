var q = require("q");
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
    return q(/*leaf*/).then(function() {
        this.doUnassign();
    });
};

/**
 *  Puts employee into vacation. Unassigns any work scheduled. 
 */
autoMechanicSchema.methods.beginVacation = function () {
    return q(/*leaf*/).then(function() {
        ;
    });
};

/**
 *  Brings the employee back from vacation. Employee can be assigned work again. 
 */
autoMechanicSchema.methods.endVacation = function () {
};

autoMechanicSchema.methods.retire = function () {
    return q(/*leaf*/).then(function() {
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    return this['firstName'] + " " + this['lastName'];
});

autoMechanicSchema.virtual('working').get(function () {
    return this['status'] == "Working";
});

autoMechanicSchema.virtual('workInProgress').get(function () {
    return q(/*leaf*/).then(function() {
        return this.getCurrentServices();
    }).then(function(/*singleChild*/read_currentServices) {
        return !/*TBD*/isEmpty;
    });
});

autoMechanicSchema.virtual('workScheduled').get(function () {
    return q(/*leaf*/).then(function() {
        return this.getUpcomingServices();
    }).then(function(/*singleChild*/read_upcomingServices) {
        return !/*TBD*/isEmpty;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

/**
 *  Services currently in progress by this worker. 
 */
autoMechanicSchema.methods.getCurrentServices = function () {
    return q(/*parallel*/).all([
        q(/*leaf*/).then(function() {
            return Service.findOne({ _id : this.services }).exec();
        }), q(/*leaf*/).then(function() {
            return "InProgress";
        })
    ]).spread(function(read_services, valueSpecificationAction) {
        return Service.byStatus(read_services, valueSpecificationAction);
    }).then(function(/*singleChild*/call_byStatus) {
        return call_byStatus;
    });
};

/**
 *  Services assigned to this worker but not yet started. 
 */
autoMechanicSchema.methods.getUpcomingServices = function () {
    return q(/*parallel*/).all([
        q(/*leaf*/).then(function() {
            return Service.findOne({ _id : this.services }).exec();
        }), q(/*leaf*/).then(function() {
            return "Booked";
        })
    ]).spread(function(read_services, valueSpecificationAction) {
        return Service.byStatus(read_services, valueSpecificationAction);
    }).then(function(/*singleChild*/call_byStatus) {
        return call_byStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

autoMechanicSchema.methods.doUnassign = function () {
    return q(/*leaf*/).then(function() {
        return this.getUpcomingServices();
    }).then(function(/*singleChild*/read_upcomingServices) {
        /*TBD*/forEach;
    });
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

autoMechanicSchema.methods.beginVacation = function () {
    this.handleEvent('beginVacation');
};
autoMechanicSchema.methods.retire = function () {
    this.handleEvent('retire');
};
autoMechanicSchema.methods.endVacation = function () {
    this.handleEvent('endVacation');
};


// declare model on the schema
var exports = module.exports = mongoose.model('AutoMechanic', autoMechanicSchema);
