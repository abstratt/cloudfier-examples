    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var carSchema = new Schema({
        registrationNumber : {
            type : String,
            required : true
        },
        modelName : {
            type : String
        },
        pending : {
            type : Number
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
        pendingServices : [{
            type : Schema.Types.ObjectId,
            ref : "Service"
        }],
        completedServices : [{
            type : Schema.Types.ObjectId,
            ref : "Service"
        }],
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
            pending : {
                type : Boolean
            },
            status : {
                type : String,
                enum : ["Booked", "InProgress", "Completed", "Cancelled"]
            },
            estimatedDays : {
                type : Number
            },
            assigned : {
                type : Boolean
            },
            technician : {
                type : Schema.Types.ObjectId,
                ref : "AutoMechanic"
            }
        }]
    });
    var Car = mongoose.model('Car', carSchema);
    Car.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    carSchema.statics.findByRegistrationNumber = function (regNumber) {
        return count;
        this.handleEvent('findByRegistrationNumber');
    };
    
    /**
     *  Book a service on this car. 
     */
    carSchema.methods.bookService = function (description, estimateInDays) {
        Service.newService(this, description, estimateInDays);
        this.handleEvent('bookService');
    };
    /*************************** QUERIES ***************************/
    
    carSchema.statics.findByOwner = function (owner) {
        return owner.cars.exec();
        this.handleEvent('findByOwner');
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    carSchema.methods.getModelName = function () {
        return this.model.makeAndModel();
    };
    
    carSchema.methods.getPending = function () {
        return count;
    };
    
    carSchema.methods.getPendingServices = function () {
        return this.services.where('pending');
    };
    
    carSchema.methods.getCompletedServices = function () {
        return this.services.where('pending').ne(true);
    };
    
    var exports = module.exports = Car;
