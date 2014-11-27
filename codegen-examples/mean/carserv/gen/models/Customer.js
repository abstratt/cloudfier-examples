var Q = require("q");
var mongoose = require('mongoose');    
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

/*************************** QUERIES ***************************/

customerSchema.statics.findByName = function (firstName, lastName) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(this.model('Customer').find().where({\n    $or : [ \n        {\n            $eq : [ \n                firstName,\n                firstName\n            ]\n        },\n        {\n            $eq : [ \n                lastName,\n                lastName\n            ]\n        }\n    ]\n}), 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
        return Q.npost(this.model('Customer').find().where({
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
        }), 'save', [  ]).then(function(saveResult) {
            return saveResult[0];
        });
    });
};

customerSchema.statics.vipCustomers = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(this.model('Customer').find().where({ 'vip' : true }), 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
        return Q.npost(this.model('Customer').find().where({ 'vip' : true }), 'save', [  ]).then(function(saveResult) {
            return saveResult[0];
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    return this['firstName'] + " " + this['lastName'];
});

/**
 *  A valuable customer is a customer that has two or more cars with us 
 */
customerSchema.virtual('vip').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);");
        return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        console.log(cars);
        console.log("return /*TBD*/count >= 2;\n");
        return /*TBD*/count >= 2;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getPendingServices = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);");
        return Q.npost(Car, 'find', [ ({ owner : me._id }) ]);
    }).then(function(cars) {
        console.log(cars);
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
        console.log(cars);
        console.log("return /*TBD*/reduce;\n");
        return /*TBD*/reduce;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
