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
        "default" : new Date()
    },
    receivedOn : {
        type : Date,
        "default" : new Date()
    },
    description : {
        type : String,
        "default" : null
    },
    amount : {
        type : Number,
        "default" : 0
    },
    status : {
        type : String,
        enum : ["Pending", "Paid"],
        "default" : "Pending"
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
    return Q().then(function() {
        return Q().then(function() {
            console.log("charge = new Charge();\n");
            charge = new Charge();
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);");
                return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);
            }),
            Q().then(function() {
                console.log("return taxi['name'] + \" - \";");
                return taxi['name'] + " - ";
            })
        ]).spread(function(shift, add) {
            charge['description'] = add + shift['description'];
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);");
            return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);
        }).then(function(shift) {
            console.log(shift);
            console.log("charge['amount'] = shift['price'];\n");
            charge['amount'] = shift['price'];
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(taxi);\nconsole.log(\"That: \");\nconsole.log(charge);\ncharge.taxi = taxi._id\n;\n");
            console.log("This: ");
            console.log(taxi);
            console.log("That: ");
            console.log(charge);
            charge.taxi = taxi._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("charge['date'] = date;\n");
            charge['date'] = date;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(payer);\nconsole.log(\"That: \");\nconsole.log(charge);\ncharge.driver = payer._id;\nconsole.log(\"This: \");\nconsole.log(charge);\nconsole.log(\"That: \");\nconsole.log(payer);\npayer.charges.push(charge._id);\n");
            console.log("This: ");
            console.log(payer);
            console.log("That: ");
            console.log(charge);
            charge.driver = payer._id;
            console.log("This: ");
            console.log(charge);
            console.log("That: ");
            console.log(payer);
            payer.charges.push(charge._id);
        });
    }).then(function() {
        return me.save();
    });
};
/*************************** QUERIES ***************************/

chargeSchema.statics.pendingCharges = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(this.model('Charge').find().where({\n    $ne : [ \n        { 'paid' : true },\n        true\n    ]\n}), 'exec', [  ])\n;\n");
        return Q.npost(this.model('Charge').find().where({
            $ne : [ 
                { 'paid' : true },
                true
            ]
        }), 'exec', [  ])
        ;
    });
};

chargeSchema.statics.byTaxi = function (taxi) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(this.model('Charge').find().where({ taxi : taxi }), 'exec', [  ])\n;\n");
        return Q.npost(this.model('Charge').find().where({ taxi : taxi }), 'exec', [  ])
        ;
    });
};

chargeSchema.statics.paidCharges = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(this.model('Charge').find().where({ 'paid' : true }), 'exec', [  ])\n;\n");
        return Q.npost(this.model('Charge').find().where({ 'paid' : true }), 'exec', [  ])
        ;
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
