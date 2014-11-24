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
    var me = this;
    return Q.when(function() {
        console.log("this.model('Customer').find().where({<NL>    $or : [ <NL>        {<NL>            $eq : [ <NL>                firstName,<NL>                firstName<NL>            ]<NL>        },<NL>        {<NL>            $eq : [ <NL>                lastName,<NL>                lastName<NL>            ]<NL>        }<NL>    ]<NL>}).save();<NL>return q(this.model('Customer').find().where({<NL>    $or : [ <NL>        {<NL>            $eq : [ <NL>                firstName,<NL>                firstName<NL>            ]<NL>        },<NL>        {<NL>            $eq : [ <NL>                lastName,<NL>                lastName<NL>            ]<NL>        }<NL>    ]<NL>}));<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
    var me = this;
    return Q.when(function() {
        console.log("this.model('Customer').find().where({ 'vip' : true }).save();<NL>return q(this.model('Customer').find().where({ 'vip' : true }));<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
    var me = this;
    return Q.when(function() {
        console.log("return Car.find({ owner : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Car.find({ owner : me._id }).exec();
    }).then(function(read_cars) {
        return /*TBD*/count >= 2;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getPendingServices = function () {
    var me = this;
    return Q.when(function() {
        console.log("return Car.find({ owner : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Car.find({ owner : me._id }).exec();
    }).then(function(read_cars) {
        return /*TBD*/reduce;
    });
};

customerSchema.methods.getCompletedServices = function () {
    var me = this;
    return Q.when(function() {
        console.log("return Car.find({ owner : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Car.find({ owner : me._id }).exec();
    }).then(function(read_cars) {
        return /*TBD*/reduce;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
