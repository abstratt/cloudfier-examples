var q = require("q");
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
    return q().then(function() {
        this.model('Customer').find().where({
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
        }).save();
        return q(this.model('Customer').find().where({
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
        }));
    });
};

customerSchema.statics.vipCustomers = function () {
    return q().then(function() {
        this.model('Customer').find().where({ 'vip' : true }).save();
        return q(this.model('Customer').find().where({ 'vip' : true }));
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
    return q().then(function() {
        return Car.findOne({ _id : this.cars }).exec();
    }).then(function(read_cars) {
        return /*TBD*/count >= 2;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getPendingServices = function () {
    return q().then(function() {
        return Car.findOne({ _id : this.cars }).exec();
    }).then(function(read_cars) {
        return /*TBD*/reduce;
    });
};

customerSchema.methods.getCompletedServices = function () {
    return q().then(function() {
        return Car.findOne({ _id : this.cars }).exec();
    }).then(function(read_cars) {
        return /*TBD*/reduce;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
