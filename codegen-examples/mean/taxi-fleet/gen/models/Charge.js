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
    this.handleEvent('pay');    
};

chargeSchema.methods.cancelPayment = function () {
    this.handleEvent('cancelPayment');    
};

chargeSchema.statics.newCharge = function (taxi, payer, date) {
    var charge;
    charge = new Charge();
    charge.description = taxi.name + " - " + taxi.shift.description;
    charge.amount = taxi.shift.price;
    charge.taxi = taxi;
    charge.date = date;
    // link driver and charges
    charge.driver = payer;
    payer.charges.push(charge);
};
/*************************** QUERIES ***************************/

chargeSchema.statics.pendingCharges = function () {
    return Charge.find().where('paid').ne(true).exec();
};

chargeSchema.statics.byTaxi = function (taxi) {
    return Charge.find().where('taxi').eq(taxi).exec();
};

chargeSchema.statics.paidCharges = function () {
    return Charge.find().where('paid').exec();
};
/*************************** DERIVED PROPERTIES ****************/

chargeSchema.virtual('paid').get(function () {
    return this.status == "Paid";
});
/*************************** STATE MACHINE ********************/
chargeSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'pay' :
            if (this.status == 'Pending') {
                this.status = 'Paid';
                // on entering Paid
                (function() {
                    this.receivedOn = new Date();
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


// declare model on the schema
var exports = module.exports = mongoose.model('Charge', chargeSchema);
