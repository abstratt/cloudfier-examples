var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Shift = require('./Shift.js');
var Driver = require('./Driver.js');
var Charge = require('./Charge.js');

/**
 *  The vehicles that make up the fleet. 
 */
// declare schema
var taxiSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    },
    shift : {
        type : Schema.Types.ObjectId,
        ref : "Shift",
        required : true
    },
    drivers : [{
        type : Schema.Types.ObjectId,
        ref : "Driver"
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Create charges for every driver 
 */
taxiSchema.methods.charge = function (date) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.booked");
        return this.booked;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.booked');\n    return this.booked;\n}");
        throw "Precondition on charge was violated"
    }
    console.log("forEach");
    forEach;
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

taxiSchema.virtual('driverCount').get(function () {
    // isAsynchronous: false        
    console.log("return count");
    return count;
});

taxiSchema.virtual('full').get(function () {
    // isAsynchronous: false        
    console.log("return this.driverCount >= this.shift.shiftsPerDay");
    return this.driverCount >= this.shift.shiftsPerDay;
});

taxiSchema.virtual('booked').get(function () {
    // isAsynchronous: false        
    console.log("return this.driverCount > 0");
    return this.driverCount > 0;
});
/*************************** DERIVED RELATIONSHIPS ****************/

taxiSchema.methods.getPendingCharges = function () {
    // isAsynchronous: true        
    console.log("return Charge.byTaxi(this).where({n    $ne : [ n        { 'paid' : true },n        truen    ]n})");
    return Charge.byTaxi(this).where({
        $ne : [ 
            { 'paid' : true },
            true
        ]
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Taxi', taxiSchema);
