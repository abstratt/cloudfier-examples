var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

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
var Car = mongoose.model('Car', carSchema);

/*************************** ACTIONS ***************************/

carSchema.statics.findByRegistrationNumber = function (regNumber) {
    return count;
};

/**
 *  Book a service on this car. 
 */
carSchema.methods.bookService = function (description, estimateInDays) {
    Service.newService(this, description, estimateInDays);
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

carSchema.method.getPendingServices = function () {
    return this.services.where('pending');
};

carSchema.method.getCompletedServices = function () {
    return this.services.where('pending').ne(true);
};

var exports = module.exports = Car;
