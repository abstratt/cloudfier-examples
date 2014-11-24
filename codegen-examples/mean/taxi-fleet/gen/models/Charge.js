var Q = require("q");
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
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("charge = new Charge();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            charge = new Charge();
        });
    }).then(function() {
        return Q.all([
            Q.when(function() {
                console.log("return Shift.findOne({ _id : taxi.shift }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return Shift.findOne({ _id : taxi.shift }).exec();
            }),
            Q.when(function() {
                console.log("return taxi['name'] + <Q> - <Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return taxi['name'] + " - ";
            })
        ]).spread(function(read_shift, call_add) {
            charge['description'] = call_add + read_shift['description'];
        });
    }).then(function() {
        return Q.when(function() {
            console.log("return Shift.findOne({ _id : taxi.shift }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Shift.findOne({ _id : taxi.shift }).exec();
        }).then(function(read_shift) {
            charge['amount'] = read_shift['price'];
        });
    }).then(function() {
        return Q.when(function() {
            console.log("charge['taxi'] = taxi;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            charge['taxi'] = taxi;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("charge['date'] = date;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            charge['date'] = date;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("// link driver and charges<NL>charge.driver = payer;<NL>payer.charges.push(charge);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            // link driver and charges
            charge.driver = payer;
            payer.charges.push(charge);
        });
    });
};
/*************************** QUERIES ***************************/

chargeSchema.statics.pendingCharges = function () {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Charge').find().where({<NL>    $ne : [ <NL>        { 'paid' : true },<NL>        true<NL>    ]<NL>}).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Charge').find().where({
            $ne : [ 
                { 'paid' : true },
                true
            ]
        }).exec();
    });
};

chargeSchema.statics.byTaxi = function (taxi) {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Charge').find().where({ taxi : taxi }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Charge').find().where({ taxi : taxi }).exec();
    });
};

chargeSchema.statics.paidCharges = function () {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Charge').find().where({ 'paid' : true }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Charge').find().where({ 'paid' : true }).exec();
    });
};
/*************************** DERIVED PROPERTIES ****************/

chargeSchema.virtual('paid').get(function () {
    return this['status'] == "Paid";
});
/*************************** STATE MACHINE ********************/
chargeSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+"): "+ this);
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
    console.log("completed handleEvent("+ event+"): "+ this);
    
};

chargeSchema.methods.pay = function () {
    this.handleEvent('pay');
};
chargeSchema.methods.cancelPayment = function () {
    this.handleEvent('cancelPayment');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Charge', chargeSchema);
