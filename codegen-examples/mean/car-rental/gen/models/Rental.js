var q = require("q");
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
    return q(/*leaf*/).then(function() {
        return this.model('Rental').find().where({
            $and : [ 
                { car : c },
                { 'inProgress' : true }
            ]
        }).findOne().exec();
    });
};

rentalSchema.statics.currentForCustomer = function (c) {
    return q(/*leaf*/).then(function() {
        return this.model('Rental').find().where({
            $and : [ 
                { customer : c },
                { 'inProgress' : true }
            ]
        }).findOne().exec();
    });
};

rentalSchema.statics.inProgress = function () {
    return q(/*leaf*/).then(function() {
        return this.model('Rental').find().where({ 'inProgress' : true }).exec();
    });
};

rentalSchema.statics.all = function () {
    return q(/*leaf*/).then(function() {
        return this.model('Rental').find().exec();
    });
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.virtual('description').get(function () {
    return q(/*leaf*/).then(function() {
        return Car.find({ _id : this.car }).exec();
    }).then(function(/*singleChild*/read_car) {
        return Model.findOne({ _id : read_car.model }).exec();
    }).then(function(/*singleChild*/read_model) {
        return read_model['description'];
    }).then(function(/*singleChild*/read_description) {
        return read_description + " on " + this['started'];
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
