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
    // isAsynchronous: true        
    var charge;
    console.log("charge = new Charge()");
    charge = new Charge();
    
    console.log("charge.description = taxi.name + ' - ' + taxi.shift.description");
    charge.description = taxi.name + " - " + taxi.shift.description;
    
    console.log("charge.amount = taxi.shift.price");
    charge.amount = taxi.shift.price;
    
    console.log("charge.taxi = taxi");
    charge.taxi = taxi;
    
    console.log("charge.date = date");
    charge.date = date;
    
    console.log("// link driver and chargesncharge.driver = payer;npayer.charges.push(charge)");
    // link driver and charges
    charge.driver = payer;
    payer.charges.push(charge);
};
/*************************** QUERIES ***************************/

chargeSchema.statics.pendingCharges = function () {
    // isAsynchronous: true        
    console.log("return this.model('Charge').find().where({n    $ne : [ n        { 'paid' : true },n        truen    ]n}).exec()");
    return this.model('Charge').find().where({
        $ne : [ 
            { 'paid' : true },
            true
        ]
    }).exec();
};

chargeSchema.statics.byTaxi = function (taxi) {
    // isAsynchronous: true        
    console.log("return this.model('Charge').find().where({ taxi : taxi }).exec()");
    return this.model('Charge').find().where({ taxi : taxi }).exec();
};

chargeSchema.statics.paidCharges = function () {
    // isAsynchronous: true        
    console.log("return this.model('Charge').find().where({ 'paid' : true }).exec()");
    return this.model('Charge').find().where({ 'paid' : true }).exec();
};
/*************************** DERIVED PROPERTIES ****************/

chargeSchema.virtual('paid').get(function () {
    // isAsynchronous: false        
    console.log("return this.status == 'Paid'");
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
                    // isAsynchronous: true        
                    console.log("this.receivedOn = new Date()");
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
