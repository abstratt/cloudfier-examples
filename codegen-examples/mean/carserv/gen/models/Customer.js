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
        required : true,
        default : null
    },
    lastName : {
        type : String,
        required : true,
        default : null
    },
    username : {
        type : String,
        default : null
    },
    title : {
        type : String,
        required : true,
        enum : ["Mr", "Mrs", "Ms"],
        default : "Mr"
    },
    cars : [{
        type : Schema.Types.ObjectId,
        ref : "Car"
    }]
});

/*************************** QUERIES ***************************/

customerSchema.statics.findByName = function (firstName, lastName) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !firstName == null && lastName == null");
        return !firstName == null && lastName == null;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !firstName == null && lastName == null');\n    return !firstName == null && lastName == null;\n}");
        throw "Precondition on findByName was violated"
    }
    console.log("return this.model('Customer').find().where({n    $or : [ n        {n            $eq : [ n                firstName,n                firstNamen            ]n        },n        {n            $eq : [ n                lastName,n                lastNamen            ]n        }n    ]n})");
    return this.model('Customer').find().where({
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
};

customerSchema.statics.vipCustomers = function () {
    // isAsynchronous: true        
    console.log("return this.model('Customer').find().where({ 'vip' : true })");
    return this.model('Customer').find().where({ 'vip' : true });
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    // isAsynchronous: false        
    console.log("return this.firstName + ' ' + this.lastName");
    return this.firstName + " " + this.lastName;
});

/**
 *  A valuable customer is a customer that has two or more cars with us 
 */
customerSchema.virtual('vip').get(function () {
    // isAsynchronous: false        
    console.log("return count >= 2");
    return count >= 2;
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getPendingServices = function () {
    // isAsynchronous: false        
    console.log("return reduce");
    return reduce;
};

customerSchema.methods.getCompletedServices = function () {
    // isAsynchronous: false        
    console.log("return reduce");
    return reduce;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
