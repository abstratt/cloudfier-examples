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
            // isAsynchronous: false        
            console.log("return new Date()");
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
    // isAsynchronous: true        
    console.log("return this.model('Rental').find().where({n    $and : [ n        { car : c },n        { 'inProgress' : true }n    ]n}).findOne().exec()");
    return this.model('Rental').find().where({
        $and : [ 
            { car : c },
            { 'inProgress' : true }
        ]
    }).findOne().exec();
};

rentalSchema.statics.currentForCustomer = function (c) {
    // isAsynchronous: true        
    console.log("return this.model('Rental').find().where({n    $and : [ n        { customer : c },n        { 'inProgress' : true }n    ]n}).findOne().exec()");
    return this.model('Rental').find().where({
        $and : [ 
            { customer : c },
            { 'inProgress' : true }
        ]
    }).findOne().exec();
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.virtual('description').get(function () {
    // isAsynchronous: false        
    console.log("return this.car.model.description + ' on ' + this.started");
    return this.car.model.description + " on " + this.started;
});

rentalSchema.virtual('inProgress').get(function () {
    // isAsynchronous: false        
    console.log("return this.returned == null");
    return this.returned == null;
});
/*************************** PRIVATE OPS ***********************/

rentalSchema.methods.finish = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.inProgress");
        return this.inProgress;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.inProgress');\n    return this.inProgress;\n}");
        throw "Precondition on finish was violated"
    }
    console.log("this.returned = new Date()");
    this.returned = new Date();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Rental', rentalSchema);
