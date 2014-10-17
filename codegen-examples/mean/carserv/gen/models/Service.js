var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var serviceSchema = new Schema({
    description : {
        type : String,
        required : true
    },
    bookedOn : {
        type : Date
    },
    estimatedReady : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        enum : ["Booked", "InProgress", "Completed", "Cancelled"]
    },
    technician : {
        type : Schema.Types.ObjectId,
        ref : "AutoMechanic"
    }
});
var Service = mongoose.model('Service', serviceSchema);

/*************************** ACTIONS ***************************/

serviceSchema.statics.newService = function (carToService, description, estimate) {
    var s = new Service();
    s.estimatedReady = new Date(s.bookedOn + estimate);
    s.description = description;
    s.car = carToService;
    return s;
};

/**
 *  Cancels a service. 
 */
serviceSchema.methods.cancel = function () {
    this.handleEvent('cancel');    
};

/**
 *  Starts the service. It can no longer be canceled. 
 */
serviceSchema.methods.start = function () {
    this.handleEvent('start');
};

/**
 *  Completes the service. 
 */
serviceSchema.methods.complete = function () {
    this.handleEvent('complete');
};

/**
 *  Assigns a service that is available to a technician. 
 */
serviceSchema.methods.assignTo = function (technician) {
    this.technician = technician;
    this.handleEvent('assignTo');
};

/**
 *  Assigns a service to a different technician other than the one currently assigned. 
 */
serviceSchema.methods.transfer = function (mechanic) {
    this.technician = mechanic;
    this.handleEvent('transfer');
};
/*************************** QUERIES ***************************/

serviceSchema.statics.byStatus = function (services, toMatch) {
    return services.where('status').eq(toMatch).exec();
};
/*************************** DERIVED PROPERTIES ****************/

serviceSchema.virtual('pending').get(function () {
    return this.status == null || this.status == null;
});

serviceSchema.virtual('estimatedDays').get(function () {
    return (this.estimatedReady - this.bookedOn) / (1000*60*60*24);
});

serviceSchema.virtual('assigned').get(function () {
    return !(this.technician == null);
});
/*************************** STATE MACHINE ********************/
serviceSchema.methods.handleEvent = function (event) {
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
};


var exports = module.exports = Service;
