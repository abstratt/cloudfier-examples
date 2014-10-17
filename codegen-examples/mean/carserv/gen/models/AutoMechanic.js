var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var autoMechanicSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    username : {
        type : String
    },
    status : {
        type : String,
        enum : ["Working", "Vacation", "Retired"]
    },
    services : [{
        type : Schema.Types.ObjectId,
        ref : "Service"
    }]
});
var AutoMechanic = mongoose.model('AutoMechanic', autoMechanicSchema);

/*************************** ACTIONS ***************************/

/**
 *  Unassigns any work scheduled. Does not affect work in progress. 
 */
autoMechanicSchema.methods.unassign = function () {
    this.doUnassign();
    this.handleEvent('unassign');
};

/**
 *  Puts employee into vacation. Unassigns any work scheduled. 
 */
autoMechanicSchema.methods.beginVacation = function () {
    this.handleEvent('beginVacation');
};

/**
 *  Brings the employee back from vacation. Employee can be assigned work again. 
 */
autoMechanicSchema.methods.endVacation = function () {
    this.handleEvent('endVacation');    
};

autoMechanicSchema.methods.retire = function () {
    this.handleEvent('retire');
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    return this.firstName + " " + this.lastName;
});

autoMechanicSchema.virtual('working').get(function () {
    return this.status == null;
});

autoMechanicSchema.virtual('workInProgress').get(function () {
    return !(isEmpty);
});

autoMechanicSchema.virtual('workScheduled').get(function () {
    return !(isEmpty);
});
/*************************** DERIVED RELATIONSHIPS ****************/

/**
 *  Services currently in progress by this worker. 
 */
autoMechanicSchema.method.getCurrentServices = function () {
    return Service.byStatus(this.services, null);
};

/**
 *  Services assigned to this worker but not yet started. 
 */
autoMechanicSchema.method.getUpcomingServices = function () {
    return Service.byStatus(this.services, null);
};
/*************************** PRIVATE OPS ***********************/

autoMechanicSchema.methods.doUnassign = function () {
    forEach;
    this.handleEvent('doUnassign');
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


var exports = module.exports = AutoMechanic;
