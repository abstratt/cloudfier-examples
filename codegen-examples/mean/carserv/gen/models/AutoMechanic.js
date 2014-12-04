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
    username : {
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
//            autoMechanicSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

/**
 *  Unassigns any work scheduled. Does not affect work in progress. 
 */
autoMechanicSchema.methods.unassign = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return me.isWorkScheduled();");
            return me.isWorkScheduled();
        }).then(function(workScheduled) {
            console.log("return workScheduled;\n");
            return workScheduled;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: NoWorkScheduled (on 'carserv::AutoMechanic::unassign')");
            error.context = 'carserv::AutoMechanic::unassign';
            error.constraint = 'NoWorkScheduled';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return me.doUnassign();");
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
            console.log("return me.isWorkInProgress();");
            return me.isWorkInProgress();
        }).then(function(workInProgress) {
            console.log("return !(workInProgress);\n");
            return !(workInProgress);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: NoWorkInProgress (on 'carserv::AutoMechanic::beginVacation')");
            error.context = 'carserv::AutoMechanic::beginVacation';
            error.constraint = 'NoWorkInProgress';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log(";\n");
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
            console.log("return me.isWorkInProgress();");
            return me.isWorkInProgress();
        }).then(function(workInProgress) {
            console.log("return !(workInProgress);\n");
            return !(workInProgress);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: NoWorkInProgress (on 'carserv::AutoMechanic::retire')");
            error.context = 'carserv::AutoMechanic::retire';
            error.constraint = 'NoWorkInProgress';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log(";\n");
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
    console.log("this.fullName: " + JSON.stringify(this));
    /*sync*/console.log("return  this.firstName + \" \" +  this.lastName;");
    return  this.firstName + " " +  this.lastName;
};

autoMechanicSchema.methods.isWorking = function () {
    console.log("this.working: " + JSON.stringify(this));
    /*sync*/console.log("return  this.status == \"Working\";");
    return  this.status == "Working";
};

autoMechanicSchema.methods.isWorkInProgress = function () {
    console.log("this.workInProgress: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.getCurrentServices();");
        return me.getCurrentServices();
    }).then(function(currentServices) {
        console.log("return !(/*TBD*/isEmpty);\n");
        return !(/*TBD*/isEmpty);
    });
};

autoMechanicSchema.methods.isWorkScheduled = function () {
    console.log("this.workScheduled: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.getUpcomingServices();");
        return me.getUpcomingServices();
    }).then(function(upcomingServices) {
        console.log("return !(/*TBD*/isEmpty);\n");
        return !(/*TBD*/isEmpty);
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
            console.log("return Q.npost(Service, 'find', [ ({ technician : me._id }) ]);");
            return Q.npost(Service, 'find', [ ({ technician : me._id }) ]);
        }),
        Q().then(function() {
            console.log("return \"InProgress\";");
            return "InProgress";
        })
    ]).spread(function(services, valueSpecificationAction) {
        console.log("services:" + services);console.log("valueSpecificationAction:" + valueSpecificationAction);
        return Service.byStatus(services, valueSpecificationAction);
    }).then(function(byStatus) {
        console.log("return byStatus;\n");
        return byStatus;
    });
};

/**
 *  Services assigned to this worker but not yet started. 
 */
autoMechanicSchema.methods.getUpcomingServices = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Service, 'find', [ ({ technician : me._id }) ]);");
            return Q.npost(Service, 'find', [ ({ technician : me._id }) ]);
        }),
        Q().then(function() {
            console.log("return \"Booked\";");
            return "Booked";
        })
    ]).spread(function(services, valueSpecificationAction) {
        console.log("services:" + services);console.log("valueSpecificationAction:" + valueSpecificationAction);
        return Service.byStatus(services, valueSpecificationAction);
    }).then(function(byStatus) {
        console.log("return byStatus;\n");
        return byStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

autoMechanicSchema.methods.doUnassign = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.getUpcomingServices();");
        return me.getUpcomingServices();
    }).then(function(upcomingServices) {
        console.log("/*TBD*/forEach;\n");
        /*TBD*/forEach;
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
    console.log("started handleEvent("+ event+")");
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
    console.log("completed handleEvent("+ event+")");
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
