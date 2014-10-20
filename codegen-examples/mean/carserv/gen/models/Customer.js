var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var customerSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    username : {
        type : String
    },
    title : {
        type : String,
        required : true,
        enum : ["Mr", "Mrs", "Ms"]
    },
    cars : [{
        type : Schema.Types.ObjectId,
        ref : "Car"
    }]
});

/*************************** QUERIES ***************************/

customerSchema.statics.findByName = function (firstName, lastName) {
    return getEntity('Customer').find().where('firstName').equals(firstName).or(.where('lastName').equals(lastName)).exec();
};

customerSchema.statics.vipCustomers = function () {
    return getEntity('Customer').find().where('vip').exec();
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
