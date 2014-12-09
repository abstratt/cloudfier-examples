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
            /*sync*/return new Date();
        })()
    },
    estimatedReady : {
        type : Date,
        "default" : (function() {
            /*sync*/return new Date(new Date() + 1* 1000 * 60 * 60 * 24 /*days*/);
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
        /*sync*/return  this.estimatedReady == null ||  this.bookedOn == null ||  this.getEstimatedDays() >= 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var s;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return Q.npost(Integer, 'findOne', [ ({ _id : estimate._id }) ]);
        }).then(function(estimate) {
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
                s = new Service();
            });
        }).then(function() {
            return Q.all([
                Q().then(function() {
                    return Q.npost(Integer, 'findOne', [ ({ _id : estimate._id }) ]);
                }),
                Q().then(function() {
                    return s.bookedOn;
                })
            ]).spread(function(estimate, bookedOn) {
                s['estimatedReady'] = new Date(bookedOn + estimate* 1000 * 60 * 60 * 24 /*days*/);
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
            }).then(function(description) {
                s['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(Car, 'findOne', [ ({ _id : carToService._id }) ]);
            }).then(function(carToService) {
                s.car = carToService._id;
                carToService.services.push(s._id);
            });
        }).then(function() {
            return Q().then(function() {
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
            return me.isAssigned();
        }).then(function(assigned) {
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
        /*sync*/return me.isPending();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: MustBePending (on 'carserv::Service::assignTo')");
            error.context = 'carserv::Service::assignTo';
            error.constraint = 'MustBePending';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return me.isAssigned();
        }).then(function(assigned) {
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
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : technician._id }) ]);
        }).then(function(technician) {
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
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : technician._id }) ]);
        }).then(function(technician) {
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
        /*sync*/return me.isPending();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: MustBePending (on 'carserv::Service::transfer')");
            error.context = 'carserv::Service::transfer';
            error.constraint = 'MustBePending';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return me.isAssigned();
        }).then(function(assigned) {
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
                return Q.npost(AutoMechanic, 'findOne', [ ({ _id : me.technician }) ]);
            }),
            Q().then(function() {
                return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);
            })
        ]).spread(function(technician, mechanic) {
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
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);
        }).then(function(mechanic) {
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
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : mechanic._id }) ]);
        }).then(function(mechanic) {
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
        return Q.npost(Service, 'findOne', [ ({ _id : services._id }) ]);
    }).then(function(services) {
        return Q.npost(services.where({ /*read-structural-feature*/status : toMatch }), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.methods.isPending = function () {
    /*sync*/return  this.status == "Booked" ||  this.status == "InProgress";
};

serviceSchema.methods.getEstimatedDays = function () {
    /*sync*/return ( this.estimatedReady -  this.bookedOn) / (1000*60*60*24);
};

serviceSchema.methods.isAssigned = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(AutoMechanic, 'findOne', [ ({ _id : me.technician }) ]);
        }),
        Q().then(function() {
            return null;
        })
    ]).spread(function(technician, valueSpecificationAction) {
        return !(technician == valueSpecificationAction);
    });
};
/*************************** STATE MACHINE ********************/
serviceSchema.methods.handleEvent = function (event) {
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
