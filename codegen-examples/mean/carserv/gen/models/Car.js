var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Model = require('./Model.js');
var AutoMechanic = require('./AutoMechanic.js');
var Service = require('./Service.js');
var Person = require('./Person.js');

// declare schema
var carSchema = new Schema({
    registrationNumber : {
        type : String,
        required : true,
        default : null
    },
    model : {
        type : Schema.Types.ObjectId,
        ref : "Model",
        required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "Customer",
        required : true
    },
    services : [{
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
    }]
});

/*************************** ACTIONS ***************************/

carSchema.statics.findByRegistrationNumber = function (regNumber) {
    return exists;
};

/**
 *  Book a service on this car. 
 */
carSchema.methods.bookService = function (description, estimateInDays) {
    Service.newService(this, description, estimateInDays);
    return this.save();
};
/*************************** QUERIES ***************************/

carSchema.statics.findByOwner = function (owner) {
    return owner.cars;
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('modelName').get(function () {
    return this.model.makeAndModel();
});

carSchema.virtual('pending').get(function () {
    return count;
});
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getPendingServices = function () {
    return this.services.where('pending');
};

carSchema.methods.getCompletedServices = function () {
    return this.services.where('pending').ne(true);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
