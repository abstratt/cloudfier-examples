var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var carSchema = new Schema({
    registrationNumber : {
        type : String,
        required : true
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
    require('./Service.js').newService(this, description, estimateInDays);
};
/*************************** QUERIES ***************************/

carSchema.statics.findByOwner = function (owner) {
    return owner.cars.exec();
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
