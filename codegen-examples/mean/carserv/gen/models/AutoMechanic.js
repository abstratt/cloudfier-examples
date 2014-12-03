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
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
};

/**
 *  Puts employee into vacation. Unassigns any work scheduled. 
 */
autoMechanicSchema.methods.beginVacation = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
};

/**
 *  Brings the employee back from vacation. Employee can be assigned work again. 
 */
autoMechanicSchema.methods.endVacation = function () {
};

autoMechanicSchema.methods.retire = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    return this.firstName + " " + this.lastName;
});

autoMechanicSchema.virtual('working').get(function () {
    return this.status == "Working";
});

autoMechanicSchema.virtual('workInProgress').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.getCurrentServices();");
        return me.getCurrentServices();
    }).then(function(currentServices) {
        console.log("return !/*TBD*/isEmpty;\n");
        return !/*TBD*/isEmpty;
    });
});

autoMechanicSchema.virtual('workScheduled').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.getUpcomingServices();");
        return me.getUpcomingServices();
    }).then(function(upcomingServices) {
        console.log("return !/*TBD*/isEmpty;\n");
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
        Q().then(function() {
            console.log("return Q.npost(Service, 'find', [ ({ technician : me._id }) ]);");
            return Q.npost(Service, 'find', [ ({ technician : me._id }) ]);
        }),
        Q().then(function() {
            console.log("return \"InProgress\";");
            return "InProgress";
        })
    ]).spread(function(services, valueSpecificationAction) {
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
        return Service.byStatus(services, valueSpecificationAction);
    }).then(function(byStatus) {
        console.log("return byStatus;\n");
        return byStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

autoMechanicSchema.methods.doUnassign = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
