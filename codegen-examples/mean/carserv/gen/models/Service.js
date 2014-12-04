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
            /*sync*/console.log("return new Date();");
            return new Date();
        })()
    },
    estimatedReady : {
        type : Date,
        "default" : (function() {
            /*sync*/console.log("return new Date(new Date() + 1);");
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

serviceSchema.path('estimatedReady').validate(
    function() {
        /*sync*/console.log("return  this.estimatedReady == null ||  this.bookedOn == null ||  this.getEstimatedDays() >= 0;");
        return  this.estimatedReady == null ||  this.bookedOn == null ||  this.getEstimatedDays() >= 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var s;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Integer, 'findOne', [ ({ _id : estimate._id }) ]);");
            return Q.npost(Integer, 'findOne', [ ({ _id : estimate._id }) ]);
        }).then(function(estimate) {
            console.log("return estimate > 0;\n");
            return estimate > 0;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: EstimateMustBePositive (on 'carserv::Service::newService')");
            error.context = 'carserv::Service::newService';
            error.constraint = 'EstimateMustBePositive';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                console.log("s = new Service();\n");
                s = new Service();
            });
        }).then(function() {
            return Q.all([
                Q().then(function() {
                    console.log("return Q.npost(Integer, 'findOne', [ ({ _id : estimate._id }) ]);");
                    return Q.npost(Integer, 'findOne', [ ({ _id : estimate._id }) ]);
                }),
                Q().then(function() {
                    console.log("return s.bookedOn;");
                    return s.bookedOn;
                })
            ]).spread(function(estimate, bookedOn) {
                console.log("estimate:" + estimate);console.log("bookedOn:" + bookedOn);
                s['estimatedReady'] = new Date(bookedOn + estimate);
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);");
                return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
            }).then(function(description) {
                console.log("s['description'] = description;\n");
                s['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Car, 'findOne', [ ({ _id : carToService._id }) ]);");
                return Q.npost(Car, 'findOne', [ ({ _id : carToService._id }) ]);
            }).then(function(carToService) {
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
    return Q().then(function() {
        return Q().then(function() {
            console.log("return me.isAssigned();");
            return me.isAssigned();
        }).then(function(assigned) {
            console.log("return assigned;\n");
            return assigned;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'carserv::Service::start')");
            error.context = 'carserv::Service::start';
            error.constraint = '';
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
 *  Completes the service. 
 */
serviceSchema.methods.complete = function () {
    var me = this;
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
};

/**
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    var me = this;
    return Q().then(function() {
        /*sync*/console.log("return me.isPending();");
        return me.isPending();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: MustBePending (on 'carserv::Service::assignTo')");
            error.context = 'carserv::Service::assignTo';
            error.constraint = 'MustBePending';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return me.isAssigned();");
            return me.isAssigned();
        }).then(function(assigned) {
            console.log("return !(assigned);\n");
            return !(assigned);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: MustNotBeAssigned (on 'carserv::Service::assignTo')");
            error.context = 'carserv::Service::assignTo';
            error.constraint = 'MustNotBeAssigned';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(AutoMechanic, 'findOne', [ ({ _id : technician._id }) ]);");
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : technician._id }) ]);
        }).then(function(technician) {
            console.log("return technician.isWorking();\n");
            return technician.isWorking();
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: TechnicianMustBeWorking (on 'carserv::Service::assignTo')");
            error.context = 'carserv::Service::assignTo';
            error.constraint = 'TechnicianMustBeWorking';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(AutoMechanic, 'findOne', [ ({ _id : technician._id }) ]);");
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : technician._id }) ]);
        }).then(function(technician) {
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
    });
};

/**
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    var me = this;
    return Q().then(function() {
        /*sync*/console.log("return me.isPending();");
        return me.isPending();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: MustBePending (on 'carserv::Service::transfer')");
            error.context = 'carserv::Service::transfer';
            error.constraint = 'MustBePending';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return me.isAssigned();");
            return me.isAssigned();
        }).then(function(assigned) {
            console.log("return assigned;\n");
            return assigned;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: MustBeAssigned (on 'carserv::Service::transfer')");
            error.context = 'carserv::Service::transfer';
            error.constraint = 'MustBeAssigned';
            throw error;
        }    
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return Q.npost(AutoMechanic, 'findOne', [ ({ _id : me.technician }) ]);");
                return Q.npost(AutoMechanic, 'findOne', [ ({ _id : me.technician }) ]);
            }),
            Q().then(function() {
                console.log("return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);");
                return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);
            })
        ]).spread(function(technician, mechanic) {
            console.log("technician:" + technician);console.log("mechanic:" + mechanic);
            return !(technician == mechanic);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: AlreadyAssigned (on 'carserv::Service::transfer')");
            error.context = 'carserv::Service::transfer';
            error.constraint = 'AlreadyAssigned';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);");
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);
        }).then(function(mechanic) {
            console.log("return mechanic.isWorking();\n");
            return mechanic.isWorking();
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: TechnicianMustBeWorking (on 'carserv::Service::transfer')");
            error.context = 'carserv::Service::transfer';
            error.constraint = 'TechnicianMustBeWorking';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);");
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);
        }).then(function(mechanic) {
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
    });
};
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Service, 'findOne', [ ({ _id : services._id }) ]);");
        return Q.npost(Service, 'findOne', [ ({ _id : services._id }) ]);
    }).then(function(services) {
        console.log("return Q.npost(services.where({ status : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(services.where({ status : toMatch }), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.methods.isPending = function () {
    console.log("this.pending: " + JSON.stringify(this));
    /*sync*/console.log("return  this.status == \"Booked\" ||  this.status == \"InProgress\";");
    return  this.status == "Booked" ||  this.status == "InProgress";
};

serviceSchema.methods.getEstimatedDays = function () {
    console.log("this.estimatedDays: " + JSON.stringify(this));
    /*sync*/console.log("return ( this.estimatedReady -  this.bookedOn) / (1000*60*60*24);");
    return ( this.estimatedReady -  this.bookedOn) / (1000*60*60*24);
};

serviceSchema.methods.isAssigned = function () {
    console.log("this.assigned: " + JSON.stringify(this));
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
        console.log("technician:" + technician);console.log("valueSpecificationAction:" + valueSpecificationAction);
        return !(technician == valueSpecificationAction);
    });
};
/*************************** STATE MACHINE ********************/
serviceSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+")");
    switch (event) {
        case 'cancel' :
            if (this.status == 'Booked') {
                this.status = 'Cancelled';
                break;
            }
            break;
        
        case 'start' :
            if (this.status == 'Booked') {
                this.status = 'InProgress';
                break;
            }
            break;
        
        case 'complete' :
            if (this.status == 'InProgress') {
                this.status = 'Completed';
                break;
            }
            break;
    }
    console.log("completed handleEvent("+ event+")");
    return Q.npost( this, 'save', [  ]);
};

serviceSchema.methods.cancel = function () {
    return this.handleEvent('cancel');
};
serviceSchema.methods.start = function () {
    return this.handleEvent('start');
};
serviceSchema.methods.complete = function () {
    return this.handleEvent('complete');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Service', serviceSchema);
