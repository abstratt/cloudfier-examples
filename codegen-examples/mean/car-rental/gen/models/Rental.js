var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Model = require('./Model.js');
var Car = require('./Car.js');

// declare schema
var rentalSchema = new Schema({
    started : {
        type : Date,
        default : (function() {
            return new Date();
        })()
    },
    returned : {
        type : Date,
        default : new Date()
    },
    car : {
        type : Schema.Types.ObjectId,
        ref : "Car"
    },
    customer : {
        type : Schema.Types.ObjectId,
        ref : "Customer"
    }
});

/*************************** QUERIES ***************************/

rentalSchema.statics.currentForCar = function (c) {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Rental').find().where({<NL>    $and : [ <NL>        { car : c },<NL>        { 'inProgress' : true }<NL>    ]<NL>}).findOne().exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Rental').find().where({
            $and : [ 
                { car : c },
                { 'inProgress' : true }
            ]
        }).findOne().exec();
    });
};

rentalSchema.statics.currentForCustomer = function (c) {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Rental').find().where({<NL>    $and : [ <NL>        { customer : c },<NL>        { 'inProgress' : true }<NL>    ]<NL>}).findOne().exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Rental').find().where({
            $and : [ 
                { customer : c },
                { 'inProgress' : true }
            ]
        }).findOne().exec();
    });
};

rentalSchema.statics.inProgress = function () {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Rental').find().where({ 'inProgress' : true }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Rental').find().where({ 'inProgress' : true }).exec();
    });
};

rentalSchema.statics.all = function () {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Rental').find().exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Rental').find().exec();
    });
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.virtual('description').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return Car.findOne({ _id : me.car }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Car.findOne({ _id : me.car }).exec();
    }).then(function(read_car) {
        return Model.findOne({ _id : read_car.model }).exec();
    }).then(function(read_model) {
        return read_model['description'];
    }).then(function(read_description) {
        return read_description + " on " + me['started'];
    });
});

rentalSchema.virtual('inProgress').get(function () {
    return this['returned'] == null;
});
/*************************** PRIVATE OPS ***********************/

rentalSchema.methods.finish = function () {
    this['returned'] = new Date();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Rental', rentalSchema);
