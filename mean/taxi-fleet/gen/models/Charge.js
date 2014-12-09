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
            charge = new Charge();
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
            }).then(function(taxi) {
                return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);
            }),
            Q().then(function() {
                return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
            }).then(function(taxi) {
                return taxi.name + " - ";
            })
        ]).spread(function(shift, add) {
            charge['description'] = add + shift.description;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
        }).then(function(taxi) {
            return Q.npost(Shift, 'findOne', [ ({ _id : taxi.shift }) ]);
        }).then(function(shift) {
            charge['amount'] = shift.price;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Taxi, 'findOne', [ ({ _id : taxi._id }) ]);
        }).then(function(taxi) {
            charge.taxi = taxi._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);
        }).then(function(date) {
            charge['date'] = date;
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return Q.npost(Driver, 'findOne', [ ({ _id : payer._id }) ]);
            }),
            Q().then(function() {
                return charge;
            })
        ]).spread(function(payer, charge) {
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
        return Q.npost(mongoose.model('Charge').find().where({
            $ne : [ 
                { /*read-structural-feature*/status : null },
                true
            ]
        }), 'exec', [  ])
        ;
    });
};

chargeSchema.statics.byTaxi = function (taxi) {
    var me = this;
    return Q().then(function() {
        return Q.npost(mongoose.model('Charge').find().where({ /*read-structural-feature*/taxi : taxi }), 'exec', [  ])
        ;
    });
};

chargeSchema.statics.paidCharges = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(mongoose.model('Charge').find().where({ /*read-structural-feature*/status : null }), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

chargeSchema.methods.isPaid = function () {
    /*sync*/return  this.status == "Paid";
};
/*************************** STATE MACHINE ********************/
chargeSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'pay' :
            if (this.status == 'Pending') {
                this.status = 'Paid';
                // on entering Paid
                (function() {
                    /*sync*/ this['receivedOn'] = new Date();
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
