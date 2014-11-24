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
        required : true,
        default : null
    },
    bookedOn : {
        type : Date,
        default : (function() {
            return new Date();
        })()
    },
    estimatedReady : {
        type : Date,
        required : true,
        default : (function() {
            return new Date(new Date() + 1);
        })()
    },
    status : {
        type : String,
        enum : ["Booked", "InProgress", "Completed", "Cancelled"],
        default : "Booked"
    },
    technician : {
        type : Schema.Types.ObjectId,
        ref : "AutoMechanic"
    }
});
/*************************** INVARIANTS ***************************/

serviceSchema.path('estimatedReady').validate(
    function() {
        return this['estimatedReady'] == null || this['bookedOn'] == null || this['estimatedDays'] >= 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var s;
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("s = new Service();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            s = new Service();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("s['estimatedReady'] = new Date(s['bookedOn'] + estimate);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            s['estimatedReady'] = new Date(s['bookedOn'] + estimate);
        });
    }).then(function() {
        return Q.when(function() {
            console.log("s['description'] = description;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            s['description'] = description;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("s['car'] = carToService;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            s['car'] = carToService;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("s.save();<NL>return q(s);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            s.save();
            return q(s);
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
    return Q.when(function() {
        console.log(";".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        ;
    });
};

/**
 *  Completes the service. 
 */
serviceSchema.methods.complete = function () {
    var me = this;
    return Q.when(function() {
        console.log(";".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        ;
    });
};

/**
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    var me = this;
    return Q.when(function() {
        console.log("me['technician'] = technician;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['technician'] = technician;
    });
};

/**
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    var me = this;
    return Q.when(function() {
        console.log("me['technician'] = mechanic;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['technician'] = mechanic;
    });
};
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    var me = this;
    return Q.when(function() {
        console.log("return services.where({ status : toMatch }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return services.where({ status : toMatch }).exec();
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
        Q.when(function() {
            console.log("return AutoMechanic.findOne({ _id : me.technician }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return AutoMechanic.findOne({ _id : me.technician }).exec();
        }),
        Q.when(function() {
            console.log("return null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return null;
        })
    ]).spread(function(read_technician, valueSpecificationAction) {
        return !read_technician == valueSpecificationAction;
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
