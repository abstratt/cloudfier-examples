var Q = require("q");
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
    var me = this;
    return Q.when(function() {
        console.log("this.model('Car').find().where({<NL>    $eq : [ <NL>        regNumber,<NL>        registrationNumber<NL>    ]<NL>}).findOne().save();<NL>return q(this.model('Car').find().where({<NL>    $eq : [ <NL>        regNumber,<NL>        registrationNumber<NL>    ]<NL>}).findOne());<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        this.model('Car').find().where({
            $eq : [ 
                regNumber,
                registrationNumber
            ]
        }).findOne().save();
        return q(this.model('Car').find().where({
            $eq : [ 
                regNumber,
                registrationNumber
            ]
        }).findOne());
    });
};

/**
 *  Book a service on this car. 
 */
carSchema.methods.bookService = function (description, estimateInDays) {
    var me = this;
    return Q.when(function() {
        console.log("return Service.newService(me, description, estimateInDays);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Service.newService(me, description, estimateInDays);
    });
};
/*************************** QUERIES ***************************/

carSchema.statics.findByOwner = function (owner) {
    var me = this;
    return Q.when(function() {
        console.log("return Car.find({ owner : owner._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Car.find({ owner : owner._id }).exec();
    }).then(function(read_cars) {
        read_cars.save();
        return q(read_cars);
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('modelName').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return Model.findOne({ _id : me.model }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Model.findOne({ _id : me.model }).exec();
    }).then(function(read_model) {
        return read_model.makeAndModel();
    }).then(function(call_makeAndModel) {
        return call_makeAndModel;
    });
});

carSchema.virtual('pending').get(function () {
    return /*TBD*/count;
});
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getPendingServices = function () {
    return this['services'].where({ 'pending' : true });
};

carSchema.methods.getCompletedServices = function () {
    return this['services'].where({
        $ne : [ 
            { 'pending' : true },
            true
        ]
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
