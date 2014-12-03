var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : null
    },
    bookedOn : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    estimatedReady : {
        type : Date,
        "default" : (function() {
            return new Date(new Date() + 1);
        })()
    },
    status : {
        type : String,
        enum : ["Booked", "InProgress", "Completed", "Cancelled"],
        "default" : "Booked"
    },
    technician : {
        type : Schema.Types.ObjectId,
        ref : "AutoMechanic"
    }
});
//            serviceSchema.set('toObject', { getters: true });

/*************************** INVARIANTS ***************************/


/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var s;
    return /* Working set: [s] */Q().then(function() {
        return Q().then(function() {
            console.log("s = new Service();\n");
            s = new Service();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("s['estimatedReady'] = new Date(s.bookedOn + estimate);\n");
            s['estimatedReady'] = new Date(s.bookedOn + estimate);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("s['description'] = description;\n");
            s['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("s.car = carToService._id;\ncarToService.services.push(s._id);\n");
            s.car = carToService._id;
            carToService.services.push(s._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return s;\n");
            return s;
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(s, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
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
 *  Completes the service. 
 */
serviceSchema.methods.complete = function () {
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
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.technician = technician._id;\ntechnician.services.push(me._id);\n");
        me.technician = technician._id;
        technician.services.push(me._id);
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
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.technician = mechanic._id;\nmechanic.services.push(me._id);\n");
        me.technician = mechanic._id;
        mechanic.services.push(me._id);
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
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    return Q().then(function() {
        console.log("return Q.npost(services.where({ status : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(services.where({ status : toMatch }), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.virtual('pending').get(function () {
    return this.status == "Booked" || this.status == "InProgress";
});

serviceSchema.virtual('estimatedDays').get(function () {
    return (this.estimatedReady - this.bookedOn) / (1000*60*60*24);
});

serviceSchema.virtual('assigned').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(AutoMechanic, 'findOne', [ ({ _id : me.technician }) ]);");
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : me.technician }) ]);
        }),
        Q().then(function() {
            console.log("return null;");
            return null;
        })
    ]).spread(function(technician, valueSpecificationAction) {
        return !technician == valueSpecificationAction;
    });
});
/*************************** STATE MACHINE ********************/
serviceSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+")");
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
    console.log("completed handleEvent("+ event+"): "+ this);
    
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
