var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : null
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
    }]
});

/*************************** ACTIONS ***************************/

carSchema.statics.findByRegistrationNumber = function (regNumber) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(me.model('Car').find().where({\n    $eq : [ \n        regNumber,\n        registrationNumber\n    ]\n}).findOne(), 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
        return Q.npost(me.model('Car').find().where({
            $eq : [ 
                regNumber,
                registrationNumber
            ]
        }).findOne(), 'save', [  ]).then(function(saveResult) {
            return saveResult[0];
        });
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]);
    });
};

/**
 *  Book a service on this car. 
 */
carSchema.methods.bookService = function (description, estimateInDays) {
    var me = this;
    return Q().then(function() {
        console.log("return Service.newService(me, description, estimateInDays);");
        return Service.newService(me, description, estimateInDays);
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]);
    });
};
/*************************** QUERIES ***************************/

carSchema.statics.findByOwner = function (owner) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'find', [ ({ owner : owner._id }) ]);");
        return Q.npost(Car, 'find', [ ({ owner : owner._id }) ]);
    }).then(function(cars) {
        console.log(cars);
        console.log("return Q.npost(cars, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
        return Q.npost(cars, 'save', [  ]).then(function(saveResult) {
            return saveResult[0];
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.virtual('modelName').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);");
        return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);
    }).then(function(model) {
        console.log(model);
        console.log("return model.makeAndModel();");
        return model.makeAndModel();
    }).then(function(makeAndModel) {
        console.log(makeAndModel);
        console.log("return makeAndModel;\n");
        return makeAndModel;
    });
});

carSchema.virtual('pending').get(function () {
    return this.getPendingServices().length;
});
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getPendingServices = function () {
    return this['services'].where({
        $or : [ 
            { status : null },
            { status : null }
        ]
    });
};

carSchema.methods.getCompletedServices = function () {
    return this['services'].where({
        $ne : [ 
            {
                $or : [ 
                    { status : null },
                    { status : null }
                ]
            },
            true
        ]
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
