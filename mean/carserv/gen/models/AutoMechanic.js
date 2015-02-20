var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : null
    },
    lastName : {
        type : String,
        "default" : null
    },
    email : {
        type : String,
        "default" : null
    },
    status : {
        type : String,
        enum : ["Working", "Vacation", "Retired"],
        "default" : "Working"
    },
    services : [{
        type : Schema.Types.ObjectId,
        ref : "Service",
        "default" : []
    }]
});


/*************************** ACTIONS ***************************/

/**
 *  Unassigns any work scheduled. Does not affect work in progress. 
 */
autoMechanicSchema.methods.unassign = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isWorkScheduled();
        }).then(function(workScheduled) {
            return workScheduled;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: NoWorkScheduled (on 'carserv::AutoMechanic::unassign')");
            error.context = 'carserv::AutoMechanic::unassign';
            error.constraint = 'NoWorkScheduled';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q().then(function() {
            return me.doUnassign();
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

/**
 *  Puts employee into vacation. Unassigns any work scheduled. 
 */
autoMechanicSchema.methods.beginVacation = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isWorkInProgress();
        }).then(function(workInProgress) {
            return !(workInProgress);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: NoWorkInProgress (on 'carserv::AutoMechanic::beginVacation')");
            error.context = 'carserv::AutoMechanic::beginVacation';
            error.constraint = 'NoWorkInProgress';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q().then(function() {
            ;
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

/**
 *  Brings the employee back from vacation. Employee can be assigned work again. 
 */
autoMechanicSchema.methods.endVacation = function () {
};

autoMechanicSchema.methods.retire = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isWorkInProgress();
        }).then(function(workInProgress) {
            return !(workInProgress);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: NoWorkInProgress (on 'carserv::AutoMechanic::retire')");
            error.context = 'carserv::AutoMechanic::retire';
            error.constraint = 'NoWorkInProgress';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q().then(function() {
            ;
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

personSchema.methods.getFullName = function () {
    return  this.firstName + " " +  this.lastName;
};

autoMechanicSchema.methods.isWorking = function () {
    return  this.status == "Working";
};

autoMechanicSchema.methods.isWorkInProgress = function () {
    var me = this;
    return Q().then(function() {
        return me.getCurrentServices();
    }).then(function(currentServices) {
        return /*TBD*/isEmpty;
    }).then(function(isEmptyResult) {
        return !(isEmptyResult);
    });
};

autoMechanicSchema.methods.isWorkScheduled = function () {
    var me = this;
    return Q().then(function() {
        return me.getUpcomingServices();
    }).then(function(upcomingServices) {
        return /*TBD*/isEmpty;
    }).then(function(isEmptyResult) {
        return !(isEmptyResult);
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

/**
 *  Services currently in progress by this worker. 
 */
autoMechanicSchema.methods.getCurrentServices = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Service.js'), 'find', [ ({ technician : me._id }) ]);
        }),
        Q().then(function() {
            return "InProgress";
        })
    ]).spread(function(services, valueSpecificationAction) {
        return require('./Service.js').byStatus(services, valueSpecificationAction);
    }).then(function(byStatusResult) {
        return byStatusResult;
    });
};

/**
 *  Services assigned to this worker but not yet started. 
 */
autoMechanicSchema.methods.getUpcomingServices = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Service.js'), 'find', [ ({ technician : me._id }) ]);
        }),
        Q().then(function() {
            return "Booked";
        })
    ]).spread(function(services, valueSpecificationAction) {
        return require('./Service.js').byStatus(services, valueSpecificationAction);
    }).then(function(byStatusResult) {
        return byStatusResult;
    });
};
/*************************** PRIVATE OPS ***********************/

autoMechanicSchema.methods.doUnassign = function () {
    var me = this;
    return Q().then(function() {
        return me.getUpcomingServices();
    }).then(function(upcomingServices) {
        return /*TBD*/forEach;
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
};
/*************************** STATE MACHINE ********************/
autoMechanicSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'beginVacation' :
            if (this.status == 'Working') {
                this.status = 'Vacation';
                break;
            }
            break;
        
        case 'retire' :
            if (this.status == 'Working') {
                this.status = 'Retired';
                break;
            }
            break;
        
        case 'endVacation' :
            if (this.status == 'Vacation') {
                this.status = 'Working';
                break;
            }
            break;
    }
    return Q.npost( this, 'save', [  ]);
};

autoMechanicSchema.methods.beginVacation = function () {
    return this.handleEvent('beginVacation');
};
autoMechanicSchema.methods.retire = function () {
    return this.handleEvent('retire');
};
autoMechanicSchema.methods.endVacation = function () {
    return this.handleEvent('endVacation');
};


// declare model on the schema
var exports = module.exports = mongoose.model('AutoMechanic', autoMechanicSchema);
