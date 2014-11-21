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
    var charge;
    return q().then(function() {
        return q().then(function() {
            charge = new Charge();
        });
    }).then(function() {
        return q().all([
            q().then(function() {
                return Shift.findOne({ _id : taxi.shift }).exec();
            }), q().then(function() {
                return taxi['name'] + " - ";
            })
        ]).spread(function(read_shift, call_add) {
            charge['description'] = call_add + read_shift['description'];
        });
    }).then(function() {
        return q().then(function() {
            return Shift.findOne({ _id : taxi.shift }).exec();
        }).then(function(read_shift) {
            charge['amount'] = read_shift['price'];
        });
    }).then(function() {
        return q().then(function() {
            charge['taxi'] = taxi;
        });
    }).then(function() {
        return q().then(function() {
            charge['date'] = date;
        });
    }).then(function() {
        return q().then(function() {
            // link driver and charges
            charge.driver = payer;
            payer.charges.push(charge);
        });
    });
};
/*************************** QUERIES ***************************/

chargeSchema.statics.pendingCharges = function () {
    return q().then(function() {
        return this.model('Charge').find().where({
            $ne : [ 
                { 'paid' : true },
                true
            ]
        }).exec();
    });
};

chargeSchema.statics.byTaxi = function (taxi) {
    return q().then(function() {
        return this.model('Charge').find().where({ taxi : taxi }).exec();
    });
};

chargeSchema.statics.paidCharges = function () {
    return q().then(function() {
        return this.model('Charge').find().where({ 'paid' : true }).exec();
    });
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
