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
    return exists.exec();
};

rentalSchema.statics.currentForCustomer = function (c) {
    return exists.exec();
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.virtual('description').get(function () {
    return this.car.model.description + " on " + this.started;
});

rentalSchema.virtual('inProgress').get(function () {
    return this.returned == null;
});
/*************************** PRIVATE OPS ***********************/

rentalSchema.methods.finish = function () {
    var precondition = function() {
        return this.inProgress;
    };
    if (!precondition.call(this)) {
        throw "Precondition on finish was violated"
    }
    this.returned = new Date();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Rental', rentalSchema);
