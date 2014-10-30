var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Shift = require('./Shift.js');
var Taxi = require('./Taxi.js');
var Charge = require('./Charge.js');

/**
 *  Drivers that can book taxis. 
 */
// declare schema
var driverSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    },
    taxi : {
        type : Schema.Types.ObjectId,
        ref : "Taxi"
    },
    charges : [{
        type : Schema.Types.ObjectId,
        ref : "Charge"
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Book a taxi that is currently available 
 */
driverSchema.methods.book = function (toRent) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: true        
        console.log("return <UNSUPPORTED: CallOperationAction> (exists)");
        return <UNSUPPORTED: CallOperationAction> (exists);
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: true        \n    console.log('return <UNSUPPORTED: CallOperationAction> (exists)');\n    return <UNSUPPORTED: CallOperationAction> (exists);\n}");
        throw "Precondition on book was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !toRent.full");
        return !toRent.full;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !toRent.full');\n    return !toRent.full;\n}");
        throw "Precondition on book was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !toRent == this.taxi");
        return !toRent == this.taxi;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !toRent == this.taxi');\n    return !toRent == this.taxi;\n}");
        throw "Precondition on book was violated"
    }
    console.log("// link taxi and driversnthis.taxi = toRent;ntoRent.drivers.push(this)");
    // link taxi and drivers
    this.taxi = toRent;
    toRent.drivers.push(this);
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Release a taxi that is currently booked 
 */
driverSchema.methods.release = function () {
    // isAsynchronous: false        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.hasBooking");
        return this.hasBooking;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.hasBooking');\n    return this.hasBooking;\n}");
        throw "Precondition on release was violated"
    }
    console.log("this.taxi.drivers = null;nthis.taxi = null");
    this.taxi.drivers = null;
    this.taxi = null;
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

driverSchema.virtual('hasBooking').get(function () {
    // isAsynchronous: false        
    console.log("return !this.taxi == null");
    return !this.taxi == null;
});

driverSchema.virtual('paymentDue').get(function () {
    // isAsynchronous: false        
    console.log("return !isEmpty");
    return !isEmpty;
});
/*************************** DERIVED RELATIONSHIPS ****************/

driverSchema.methods.getPendingCharges = function () {
    // isAsynchronous: false        
    console.log("return this.charges.where({n    $ne : [ n        { 'paid' : true },n        truen    ]n})");
    return this.charges.where({
        $ne : [ 
            { 'paid' : true },
            true
        ]
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Driver', driverSchema);
