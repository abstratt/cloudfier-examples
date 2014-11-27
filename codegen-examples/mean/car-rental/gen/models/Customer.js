var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Model = require('./Model.js');
var Car = require('./Car.js');
var Rental = require('./Rental.js');

// declare schema
var customerSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    rentals : [{
        type : Schema.Types.ObjectId,
        ref : "Rental",
        "default" : []
    }]
});

/*************************** ACTIONS ***************************/

customerSchema.methods.rent = function (car) {
    var rental;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("rental = new Rental();\n");
            rental = new Rental();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(rental);\nrental.customer = me._id;\nconsole.log(\"This: \");\nconsole.log(rental);\nconsole.log(\"That: \");\nconsole.log(me);\nme.rentals.push(rental._id);\n");
            console.log("This: ");
            console.log(me);
            console.log("That: ");
            console.log(rental);
            rental.customer = me._id;
            console.log("This: ");
            console.log(rental);
            console.log("That: ");
            console.log(me);
            me.rentals.push(rental._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(car);\nconsole.log(\"That: \");\nconsole.log(rental);\nrental.car = car._id;\nconsole.log(\"This: \");\nconsole.log(rental);\nconsole.log(\"That: \");\nconsole.log(car);\ncar.rentals.push(rental._id);\n");
            console.log("This: ");
            console.log(car);
            console.log("That: ");
            console.log(rental);
            rental.car = car._id;
            console.log("This: ");
            console.log(rental);
            console.log("That: ");
            console.log(car);
            car.rentals.push(rental._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("car.carRented();\nreturn Q();\n");
            car.carRented();
            return Q();
        });
    }).then(function() {
        return me.save();
    });
};

customerSchema.methods.finishRental = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return me.getCurrentRental();");
            return me.getCurrentRental();
        }).then(function(currentRental) {
            console.log(currentRental);
            console.log("return Q.npost(Car, 'findOne', [ ({ _id : currentRental.car }) ]);");
            return Q.npost(Car, 'findOne', [ ({ _id : currentRental.car }) ]);
        }).then(function(car) {
            console.log(car);
            console.log("car.carReturned();\nreturn Q();\n");
            car.carReturned();
            return Q();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return me.getCurrentRental();");
            return me.getCurrentRental();
        }).then(function(currentRental) {
            console.log(currentRental);
            console.log("currentRental.finish();\n");
            currentRental.finish();
        });
    }).then(function() {
        return me.save();
    });
};
/*************************** DERIVED PROPERTIES ****************/

customerSchema.virtual('hasCurrentRental').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return me.getCurrentRental();");
            return me.getCurrentRental();
        }),
        Q().then(function() {
            console.log("return null;");
            return null;
        })
    ]).spread(function(currentRental, valueSpecificationAction) {
        return !currentRental == valueSpecificationAction;
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

customerSchema.methods.getCurrentRental = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Rental.currentForCustomer(me);");
        return Rental.currentForCustomer(me);
    }).then(function(currentForCustomer) {
        console.log(currentForCustomer);
        console.log("return currentForCustomer;\n");
        return currentForCustomer;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
