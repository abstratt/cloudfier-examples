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
    var precondition = function() {
        return !(firstName == null && lastName == null);
    };
    if (!precondition.call(this)) {
        throw "Precondition on findByName was violated"
    }
    return getEntity('Customer').find().where('firstName').equals(firstName).or(.where('lastName').equals(lastName));
};

customerSchema.statics.vipCustomers = function () {
    return getEntity('Customer').find().where('vip');
};
/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    return this.firstName + " " + this.lastName;
});

/**
 *  A valuable customer is a customer that has two or more cars with us 
 */
customerSchema.virtual('vip').get(function () {
    return count >= 2;
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getPendingServices = function () {
    return reduce;
};

customerSchema.methods.getCompletedServices = function () {
    return reduce;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
