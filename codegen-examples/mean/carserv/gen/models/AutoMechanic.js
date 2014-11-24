var Q = require("q");
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
    var me = this;
    return Q.when(function() {
        console.log("me.doUnassign();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me.doUnassign();
    });
};

/**
 *  Puts employee into vacation. Unassigns any work scheduled. 
 */
autoMechanicSchema.methods.beginVacation = function () {
    var me = this;
    return Q.when(function() {
        console.log(";".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        ;
    });
};

/**
 *  Brings the employee back from vacation. Employee can be assigned work again. 
 */
autoMechanicSchema.methods.endVacation = function () {
};

autoMechanicSchema.methods.retire = function () {
    var me = this;
    return Q.when(function() {
        console.log(";".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
    var me = this;
    return Q.when(function() {
        console.log("return me.getCurrentServices();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.getCurrentServices();
    }).then(function(read_currentServices) {
        return !/*TBD*/isEmpty;
    });
});

autoMechanicSchema.virtual('workScheduled').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.getUpcomingServices();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.getUpcomingServices();
    }).then(function(read_upcomingServices) {
        return !/*TBD*/isEmpty;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

/**
 *  Services currently in progress by this worker. 
 */
autoMechanicSchema.methods.getCurrentServices = function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Service.find({ technician : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Service.find({ technician : me._id }).exec();
        }),
        Q.when(function() {
            console.log("return <Q>InProgress<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return "InProgress";
        })
    ]).spread(function(read_services, valueSpecificationAction) {
        return Service.byStatus(read_services, valueSpecificationAction);
    }).then(function(call_byStatus) {
        return call_byStatus;
    });
};

/**
 *  Services assigned to this worker but not yet started. 
 */
autoMechanicSchema.methods.getUpcomingServices = function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Service.find({ technician : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Service.find({ technician : me._id }).exec();
        }),
        Q.when(function() {
            console.log("return <Q>Booked<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return "Booked";
        })
    ]).spread(function(read_services, valueSpecificationAction) {
        return Service.byStatus(read_services, valueSpecificationAction);
    }).then(function(call_byStatus) {
        return call_byStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

autoMechanicSchema.methods.doUnassign = function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.getUpcomingServices();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.getUpcomingServices();
    }).then(function(read_upcomingServices) {
        /*TBD*/forEach;
    });
};
/*************************** STATE MACHINE ********************/
autoMechanicSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+"): "+ this);
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
    console.log("completed handleEvent("+ event+"): "+ this);
    
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
