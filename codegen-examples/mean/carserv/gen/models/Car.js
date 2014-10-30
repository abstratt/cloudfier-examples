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
                // isAsynchronous: false        
                console.log("return new Date()");
                return new Date();
            })()
        },
        estimatedReady : {
            type : Date,
            required : true,
            default : (function() {
                // isAsynchronous: false        
                console.log("return new Date(new Date() + 1)");
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
    // isAsynchronous: true        
    console.log("return this.model('Car').find().where({n    $eq : [ n        regNumber,n        registrationNumbern    ]n}).findOne()");
    return this.model('Car').find().where({
        $eq : [ 
            regNumber,
            registrationNumber
        ]
    }).findOne();
};

/**
 *  Book a service on this car. 
 */
carSchema.methods.bookService = function (description, estimateInDays) {
    // isAsynchronous: true        
    console.log("Service.newService(this, description, estimateInDays)");
    Service.newService(this, description, estimateInDays);
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** QUERIES ***************************/

carSchema.statics.findByOwner = function (owner) {
    // isAsynchronous: false        
    console.log("return owner.cars");
    return owner.cars;
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('modelName').get(function () {
    // isAsynchronous: false        
    console.log("return this.model.makeAndModel()");
    return this.model.makeAndModel();
});

carSchema.virtual('pending').get(function () {
    // isAsynchronous: false        
    console.log("return count");
    return count;
});
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getPendingServices = function () {
    // isAsynchronous: false        
    console.log("return this.services.where({ 'pending' : true })");
    return this.services.where({ 'pending' : true });
};

carSchema.methods.getCompletedServices = function () {
    // isAsynchronous: false        
    console.log("return this.services.where({n    $ne : [ n        { 'pending' : true },n        truen    ]n})");
    return this.services.where({
        $ne : [ 
            { 'pending' : true },
            true
        ]
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
