var Q = require("q");
var mongoose = require('mongoose');    
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
/*************************** INVARIANTS ***************************/


/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var s;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("s = new Service();\n");
            s = new Service();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("s['estimatedReady'] = new Date(s['bookedOn'] + estimate);\n");
            s['estimatedReady'] = new Date(s['bookedOn'] + estimate);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("s['description'] = description;\n");
            s['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(carToService);\nconsole.log(\"That: \");\nconsole.log(s);\ns.car = carToService._id;\nconsole.log(\"This: \");\nconsole.log(s);\nconsole.log(\"That: \");\nconsole.log(carToService);\ncarToService.services.push(s._id);\n");
            console.log("This: ");
            console.log(carToService);
            console.log("That: ");
            console.log(s);
            s.car = carToService._id;
            console.log("This: ");
            console.log(s);
            console.log("That: ");
            console.log(carToService);
            carToService.services.push(s._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(s, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(s, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
        });
    }).then(function() {
        return me.save();
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
        console.log(";\n");
        ;
    }).then(function() {
        return me.save();
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
    }).then(function() {
        return me.save();
    });
};

/**
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(technician);\nconsole.log(\"That: \");\nconsole.log(me);\nme.technician = technician._id;\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(technician);\ntechnician.services.push(me._id);\n");
        console.log("This: ");
        console.log(technician);
        console.log("That: ");
        console.log(me);
        me.technician = technician._id;
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(technician);
        technician.services.push(me._id);
    }).then(function() {
        return me.save();
    });
};

/**
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(mechanic);\nconsole.log(\"That: \");\nconsole.log(me);\nme.technician = mechanic._id;\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(mechanic);\nmechanic.services.push(me._id);\n");
        console.log("This: ");
        console.log(mechanic);
        console.log("That: ");
        console.log(me);
        me.technician = mechanic._id;
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(mechanic);
        mechanic.services.push(me._id);
    }).then(function() {
        return me.save();
    });
};
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(services.where({ status : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(services.where({ status : toMatch }), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.virtual('pending').get(function () {
    return this['status'] == "Booked" || this['status'] == "InProgress";
});

serviceSchema.virtual('estimatedDays').get(function () {
    return (this['estimatedReady'] - this['bookedOn']) / (1000*60*60*24);
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
    console.log("started handleEvent("+ event+"): "+ this);
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
