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
                /*sync*/console.log("return new Date();");
                return new Date();
            })()
        },
        estimatedReady : {
            type : Date,
            "default" : (function() {
                /*sync*/console.log("return new Date(new Date() + 1);");
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
//            carSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

carSchema.statics.findByRegistrationNumber = function (regNumber) {
    var me = this;
    return Q().then(function() {
        console.log("return mongoose.model('Car').find().where({\n    $eq : [ \n        regNumber,\n        registrationNumber\n    ]\n}).findOne();\n");
        return mongoose.model('Car').find().where({
            $eq : [ 
                regNumber,
                registrationNumber
            ]
        }).findOne();
    });
};

/**
 *  Book a service on this car. 
 */
carSchema.methods.bookService = function (description, estimateInDays) {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);");
            return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
        }),
        Q().then(function() {
            console.log("return Q.npost(Integer, 'findOne', [ ({ _id : estimateInDays._id }) ]);");
            return Q.npost(Integer, 'findOne', [ ({ _id : estimateInDays._id }) ]);
        })
    ]).spread(function(description, estimateInDays) {
        console.log("description:" + description);console.log("estimateInDays:" + estimateInDays);
        return Service.newService(me, description, estimateInDays);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};
/*************************** QUERIES ***************************/

carSchema.statics.findByOwner = function (owner) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Customer, 'findOne', [ ({ _id : owner._id }) ]);");
        return Q.npost(Customer, 'findOne', [ ({ _id : owner._id }) ]);
    }).then(function(owner) {
        console.log("return Q.npost(Car, 'find', [ ({ owner : owner._id }) ]);");
        return Q.npost(Car, 'find', [ ({ owner : owner._id }) ]);
    }).then(function(cars) {
        console.log("return cars;\n");
        return cars;
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.methods.getModelName = function () {
    console.log("this.modelName: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);");
        return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);
    }).then(function(model) {
        console.log("return model.makeAndModel();");
        return model.makeAndModel();
    }).then(function(makeAndModel) {
        console.log("return makeAndModel;\n");
        return makeAndModel;
    });
};

carSchema.methods.getPending = function () {
    console.log("this.pending: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.getPendingServices();");
        return me.getPendingServices();
    }).then(function(pendingServices) {
        console.log("return pendingServices.length;\n");
        return pendingServices.length;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getPendingServices = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.services.where({\n    $or : [ \n        { status : null },\n        { status : null }\n    ]\n});\n");
        return me.services.where({
            $or : [ 
                { status : null },
                { status : null }
            ]
        });
    });
};

carSchema.methods.getCompletedServices = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.services.where({\n    $ne : [ \n        {\n            $or : [ \n                { status : null },\n                { status : null }\n            ]\n        },\n        true\n    ]\n});\n");
        return me.services.where({
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
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
