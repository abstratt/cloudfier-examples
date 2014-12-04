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
    username : {
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


/*************************** QUERIES ***************************/

customerSchema.statics.findByName = function (firstName, lastName) {
    var me = this;
    return Q().then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return Q.npost(String, 'findOne', [ ({ _id : lastName._id }) ]);");
                return Q.npost(String, 'findOne', [ ({ _id : lastName._id }) ]);
            }),
            Q().then(function() {
                console.log("return null;");
                return null;
            }),
            Q.all([
                Q().then(function() {
                    console.log("return Q.npost(String, 'findOne', [ ({ _id : firstName._id }) ]);");
                    return Q.npost(String, 'findOne', [ ({ _id : firstName._id }) ]);
                }),
                Q().then(function() {
                    console.log("return null;");
                    return null;
                })
            ]).spread(function(firstName, valueSpecificationAction) {
                console.log("firstName:" + firstName);console.log("valueSpecificationAction:" + valueSpecificationAction);
                return firstName == valueSpecificationAction;
            })
        ]).spread(function(lastName, valueSpecificationAction, testIdentityAction) {
            console.log("lastName:" + lastName);console.log("valueSpecificationAction:" + valueSpecificationAction);console.log("testIdentityAction:" + testIdentityAction);
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
            console.log("return mongoose.model('Customer').find().where({\n    $or : [ \n        {\n            $eq : [ \n                firstName,\n                firstName\n            ]\n        },\n        {\n            $eq : [ \n                lastName,\n                lastName\n            ]\n        }\n    ]\n});\n");
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
        console.log("return mongoose.model('Customer').find().where({\n    $gte : [ \n        {\n            /*unknown:size*/size : [ \n                cars,\n                true\n            ]\n        },\n        2\n    ]\n});\n");
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
    console.log("this.fullName: " + JSON.stringify(this));
    /*sync*/console.log("return  this.firstName + \" \" +  this.lastName;");
    return  this.firstName + " " +  this.lastName;
};

/**
 *  A valuable customer is a customer that has two or more cars with us 
 */
customerSchema.methods.isVip = function () {
    console.log("this.vip: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);");
        return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        console.log("return cars.length >= 2;\n");
        return cars.length >= 2;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getPendingServices = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);");
        return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        console.log("return /*TBD*/reduce;\n");
        return /*TBD*/reduce;
    });
};

customerSchema.methods.getCompletedServices = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);");
        return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        console.log("return /*TBD*/reduce;\n");
        return /*TBD*/reduce;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
