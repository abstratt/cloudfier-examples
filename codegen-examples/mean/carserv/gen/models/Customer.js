    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var customerSchema = new Schema({
        fullName : {
            type : String
        },
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
        vip : {
            type : Boolean
        },
        cars : [{
            type : Schema.Types.ObjectId,
            ref : "Car"
        }],
        pendingServices : [{
            type : Schema.Types.ObjectId,
            ref : "Service"
        }],
        completedServices : [{
            type : Schema.Types.ObjectId,
            ref : "Service"
        }]
    });
    var Customer = mongoose.model('Customer', customerSchema);
    Customer.emitter = new EventEmitter();
    
    /*************************** QUERIES ***************************/
    
    customerSchema.statics.findByName = function (firstName, lastName) {
        return this.model('Customer').find().where('firstName').equals(firstName).or(.where('lastName').equals(lastName)).exec();
    };
    
    customerSchema.statics.vipCustomers = function () {
        return this.model('Customer').find().where('vip').exec();
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    customerSchema.methods.getPendingServices = function () {
        return reduce;
    };
    
    customerSchema.methods.getCompletedServices = function () {
        return reduce;
    };
    
    /**
     *  A valuable customer is a customer that has two or more cars with us 
     */
    customerSchema.methods.isVip = function () {
        return count >= 2;
    };
    
    personSchema.methods.getFullName = function () {
        return this.firstName + " " + this.lastName;
    };
    
    var exports = module.exports = Customer;
