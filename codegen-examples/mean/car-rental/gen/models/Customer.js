var Q = require("q");
var mongoose = require('./db.js');    
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
            console.log("rental.customer = me._id;\nme.rentals.push(rental._id);\n");
            rental.customer = me._id;
            me.rentals.push(rental._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("rental.car = car._id;\ncar.rentals.push(rental._id);\n");
            rental.car = car._id;
            car.rentals.push(rental._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("car.carRented();\n");
            car.carRented();
        });
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(rental, 'save', [  ]);
            })
        ]);
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
            console.log("car.carReturned();\n");
            car.carReturned();
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
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]);
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
