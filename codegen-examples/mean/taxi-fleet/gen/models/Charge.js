var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : null
    },
    receivedOn : {
        type : Date,
        "default" : null
    },
    description : {
        type : String,
        "default" : null
    },
    amount : {
        type : Number,
        "default" : null
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
//            chargeSchema.set('toObject', { getters: true });


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
                console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);");
                return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
            }).then(function(taxi) {
                console.log("return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);");
                return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);
            }),
            Q().then(function() {
                console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);");
                return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
            }).then(function(taxi) {
                console.log("return taxi.name + \" - \";");
                return taxi.name + " - ";
            })
        ]).spread(function(shift, add) {
            console.log("shift:" + shift);console.log("add:" + add);
            charge['description'] = add + shift.description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);");
            return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
        }).then(function(taxi) {
            console.log("return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);");
            return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);
        }).then(function(shift) {
            console.log("charge['amount'] = shift.price;\n");
            charge['amount'] = shift.price;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);");
            return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
        }).then(function(taxi) {
            console.log("charge.taxi = taxi._id\n;\n");
            charge.taxi = taxi._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);");
            return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);
        }).then(function(date) {
            console.log("charge['date'] = date;\n");
            charge['date'] = date;
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return Q.npost(Driver, 'findOne', [ ({ _id : payer._id }) ]);");
                return Q.npost(Driver, 'findOne', [ ({ _id : payer._id }) ]);
            }),
            Q().then(function() {
                console.log("return charge;");
                return charge;
            })
        ]).spread(function(payer, charge) {
            console.log("payer:" + payer);console.log("charge:" + charge);
            charge.driver = payer._id;
            payer.charges.push(charge._id);
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(charge, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    });
};
/*************************** QUERIES ***************************/

chargeSchema.statics.pendingCharges = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Charge').find().where({\n    $ne : [ \n        { status : null },\n        true\n    ]\n}), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Charge').find().where({
            $ne : [ 
                { status : null },
                true
            ]
        }), 'exec', [  ])
        ;
    });
};

chargeSchema.statics.byTaxi = function (taxi) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Charge').find().where({ taxi : taxi }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Charge').find().where({ taxi : taxi }), 'exec', [  ])
        ;
    });
};

chargeSchema.statics.paidCharges = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Charge').find().where({ status : null }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Charge').find().where({ status : null }), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

chargeSchema.methods.isPaid = function () {
    console.log("this.paid: " + JSON.stringify(this));
    /*sync*/console.log("return  this.status == \"Paid\";");
    return  this.status == "Paid";
};
/*************************** STATE MACHINE ********************/
chargeSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+")");
    switch (event) {
        case 'pay' :
            if (this.status == 'Pending') {
                this.status = 'Paid';
                // on entering Paid
                (function() {
                    /*sync*/console.log(" this['receivedOn'] = new Date();");
                     this['receivedOn'] = new Date();
                })();
                break;
            }
            break;
        
        case 'cancelPayment' :
            if (this.status == 'Paid') {
                this.status = 'Pending';
                break;
            }
            break;
    }
    console.log("completed handleEvent("+ event+")");
    return Q.npost( this, 'save', [  ]);
};

chargeSchema.methods.pay = function () {
    return this.handleEvent('pay');
};
chargeSchema.methods.cancelPayment = function () {
    return this.handleEvent('cancelPayment');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Charge', chargeSchema);
