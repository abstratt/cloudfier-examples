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
        type : Schema.Types.ObjectId,
        ref : "Service",
        "default" : []
    }]
});


/*************************** ACTIONS ***************************/

carSchema.statics.findByRegistrationNumber = function (regNumber) {
    var me = this;
    return Q().then(function() {
        return mongoose.model('Car').where({
            $eq : [ 
                regNumber,
                registrationNumber
            ]
        }).findOne();
    }).then(function(anyResult) {
        return anyResult;
    });
};

/**
 *  Book a service on this car. 
 */
carSchema.methods.bookService = function (description, estimateInDays) {
    var me = this;
    return Q().then(function() {
        return require('./Service.js').newService(me, description, estimateInDays);
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
        return Q.npost(require('./Customer.js'), 'findOne', [ ({ _id : owner._id }) ]);
    }).then(function(owner) {
        return Q.npost(require('./Car.js'), 'find', [ ({ owner : owner._id }) ]);
    }).then(function(cars) {
        return cars;
    });
};
/*************************** DERIVED PROPERTIES ****************/

carSchema.methods.getModelName = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Model.js'), 'findOne', [ ({ _id : me.model }) ]);
    }).then(function(model) {
        return model.makeAndModel();
    }).then(function(makeAndModelResult) {
        return makeAndModelResult;
    });
};

carSchema.methods.getPending = function () {
    var me = this;
    return Q().then(function() {
        return me.getPendingServices();
    }).then(function(pendingServices) {
        return pendingServices.length;
    }).then(function(sizeResult) {
        return sizeResult;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

carSchema.methods.getPendingServices = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Service.js'), 'find', [ ({ car : me._id }) ]);
    }).then(function(services) {
        return services.where({
            $or : [ 
                { status : null },
                { status : null }
            ]
        });
    }).then(function(selectResult) {
        return selectResult;
    });
};

carSchema.methods.getCompletedServices = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Service.js'), 'find', [ ({ car : me._id }) ]);
    }).then(function(services) {
        return services.where({
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
    }).then(function(selectResult) {
        return selectResult;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Car', carSchema);
