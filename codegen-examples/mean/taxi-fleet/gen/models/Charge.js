var q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Shift = require('./Shift.js');
var Taxi = require('./Taxi.js');
var Driver = require('./Driver.js');

/**
 *  Charges for renting taxis. 
 */
// declare schema
var chargeSchema = new Schema({
    date : {
        type : Date,
        default : new Date()
    },
    receivedOn : {
        type : Date,
        default : new Date()
    },
    description : {
        type : String,
        default : null
    },
    amount : {
        type : Number,
        default : 0
    },
    status : {
        type : String,
        enum : ["Pending", "Paid"],
        default : "Pending"
    },
    driver : {
        type : Schema.Types.ObjectId,
        ref : "Driver"
    },
    taxi : {
        type : Schema.Types.ObjectId,
        ref : "Taxi"
    }
});

/*************************** ACTIONS ***************************/

chargeSchema.methods.pay = function () {
};

chargeSchema.methods.cancelPayment = function () {
};

chargeSchema.statics.newCharge = function (taxi, payer, date) {
    return q().all([q().then(function() {
        return Shift.findOne({ _id : taxi.shift }).exec();
    }), q().then(function() {
        return Shift.findOne({ _id : taxi.shift }).exec();
    })]).spread(function(shift, shift) {
        var charge;
        charge = new Charge();
        charge['description'] = taxi['name'] + " - " + shift['description'];
        charge['amount'] = shift['price'];
        charge['taxi'] = taxi;
        charge['date'] = date;
        // link driver and charges
        charge.driver = payer;
        payer.charges.push(charge);
    });
};
/*************************** QUERIES ***************************/

chargeSchema.statics.pendingCharges = function () {
    return this.model('Charge').find().where({
        $ne : [ 
            { 'paid' : true },
            true
        ]
    }).exec();
};

chargeSchema.statics.byTaxi = function (taxi) {
    return q().then(function() {
        return this.model('Charge').find().where({ taxi : taxi }).exec();
    });
};

chargeSchema.statics.paidCharges = function () {
    return this.model('Charge').find().where({ 'paid' : true }).exec();
};
/*************************** DERIVED PROPERTIES ****************/

chargeSchema.virtual('paid').get(function () {
    return this['status'] == "Paid";
});
/*************************** STATE MACHINE ********************/
chargeSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'pay' :
            if (this.status == 'Pending') {
                this.status = 'Paid';
                // on entering Paid
                (function() {
                    this['receivedOn'] = new Date();
                })();
                return;
            }
            break;
        
        case 'cancelPayment' :
            if (this.status == 'Paid') {
                this.status = 'Pending';
                return;
            }
            break;
    }
};

chargeSchema.methods.pay = function () {
    this.handleEvent('pay');
};
chargeSchema.methods.cancelPayment = function () {
    this.handleEvent('cancelPayment');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Charge', chargeSchema);
