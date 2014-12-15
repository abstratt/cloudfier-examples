var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Model = require('./Model.js');
var AutoMechanic = require('./AutoMechanic.js');
var Car = require('./Car.js');
var Service = require('./Service.js');
var Person = require('./Person.js');

// declare schema
var customerSchema = new Schema({
    firstName : {
        type : String,
        "default" : null
    },
    lastName : {
        type : String,
        "default" : null
    },
    email : {
        type : String,
        "default" : null
    },
    title : {
        type : String,
        enum : ["Mr", "Mrs", "Ms"],
        "default" : "Mr"
    },
    cars : [{
        type : Schema.Types.ObjectId,
        ref : "Car",
        "default" : []
    }]
});
//            customerSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

customerSchema.statics.findByName = function (firstName, lastName) {
    var me = this;
    return Q().then(function() {
        return Q.all([
            Q().then(function() {
                return Q.npost(String, 'findOne', [ ({ _id : lastName._id }) ]);
            }),
            Q().then(function() {
                return null;
            }),
            Q.all([
                Q().then(function() {
                    return Q.npost(String, 'findOne', [ ({ _id : firstName._id }) ]);
                }),
                Q().then(function() {
                    return null;
                })
            ]).spread(function(firstName, valueSpecificationAction) {
                return firstName == valueSpecificationAction;
            })
        ]).spread(function(lastName, valueSpecificationAction, testIdentityAction) {
            return !(testIdentityAction && lastName == valueSpecificationAction);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: OneMustBeProvided (on 'carserv::Customer::findByName')");
            error.context = 'carserv::Customer::findByName';
            error.constraint = 'OneMustBeProvided';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return mongoose.model('Customer').find().where({
                $or : [ 
                    {
                        $eq : [ 
                            firstName,
                            firstName
                        ]
                    },
                    {
                        $eq : [ 
                            lastName,
                            lastName
                        ]
                    }
                ]
            });
        });
    });
};

customerSchema.statics.vipCustomers = function () {
    var me = this;
    return Q().then(function() {
        return mongoose.model('Customer').find().where({
            $gte : [ 
                {
                    /*unknown:size*/size : [ 
                        cars,
                        true
                    ]
                },
                2
            ]
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.methods.getFullName = function () {
    return  this.firstName + " " +  this.lastName;
};

/**
 *  A valuable customer is a customer that has two or more cars with us 
 */
customerSchema.methods.isVip = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Car.js'), 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        return cars.length >= 2;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getPendingServices = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Car.js'), 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        return /*TBD*/reduce;
    });
};

customerSchema.methods.getCompletedServices = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Car.js'), 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        return /*TBD*/reduce;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
