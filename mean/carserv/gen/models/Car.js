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
                /*sync*/return new Date();
            })()
        },
        estimatedReady : {
            type : Date,
            "default" : (function() {
                /*sync*/return new Date(new Date() + 1* 1000 * 60 * 60 * 24 /*days*/);
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
        return mongoose.model('Car').find().where({
            $eq : [ 
                regNumber,
                /*read-structural-feature*/registrationNumber
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
            return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
        }),
        Q().then(function() {
            return Q.npost(Integer, 'findOne', [ ({ _id : estimateInDays._id }) ]);
        })
    ]).spread(function(description, estimateInDays) {
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

carSchema.statics.findByOwner = function (owner) {
    var me = this;
    return Q().then(function() {
        return Q.npost(Customer, 'findOne', [ ({ _id : owner._id }) ]);
    }).then(function(owner) {
        return Q.npost(Car, 'find', [ ({ owner : owner._id }) ]);
    }).then(function(cars) {
        return cars;
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.methods.getModelName = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(Model, 'findOne', [ ({ _id : me.model }) ]);
    }).then(function(model) {
        return model.makeAndModel();
    }).then(function(makeAndModel) {
        return makeAndModel;
    });
};

carSchema.methods.getPending = function () {
    var me = this;
    return Q().then(function() {
        return me.getPendingServices();
    }).then(function(pendingServices) {
        return pendingServices.length;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getPendingServices = function () {
    var me = this;
    return Q().then(function() {
        return me.services.where({
            $or : [ 
                { /*read-structural-feature*/status : null },
                { /*read-structural-feature*/status : null }
            ]
        });
    });
};

carSchema.methods.getCompletedServices = function () {
    var me = this;
    return Q().then(function() {
        return me.services.where({
            $ne : [ 
                {
                    $or : [ 
                        { /*read-structural-feature*/status : null },
                        { /*read-structural-feature*/status : null }
                    ]
                },
                true
            ]
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
