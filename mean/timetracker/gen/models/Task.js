var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Client = require('./Client.js');
var Invoice = require('./Invoice.js');

// declare schema
var taskSchema = new Schema({
    description : {
        type : String,
        "default" : null
    },
    client : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    },
    reported : [{
        units : {
            type : Number,
            "default" : 0
        },
        date : {
            type : Date,
            "default" : (function() {
                return new Date();
            })()
        },
        memo : {
            type : String,
            "default" : null
        },
        invoice : {
            type : Schema.Types.ObjectId,
            ref : "Invoice"
        }
    }]
});
//            taskSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

taskSchema.methods.addWork = function (units) {
    var newWork;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            newWork = new require('./Work.js')();
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Integer, 'findOne', [ ({ _id : units._id }) ]);
        }).then(function(units) {
            newWork['units'] = units;
        });
    }).then(function() {
        return Q().then(function() {
            me.reported.push(newWork._id);
            newWork.task = me._id;
        });
    }).then(function() {
        return Q().then(function() {
            return newWork;
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(newWork, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    })
    ;
};
/*************************** DERIVED PROPERTIES ****************/

taskSchema.methods.getUnitsReported = function () {
    var me = this;
    return Q().then(function() {
        return me.countUnits(me.reported);
    }).then(function(countUnits) {
        return countUnits;
    });
};

taskSchema.methods.getUnitsToInvoice = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return me.getToInvoice();
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(toInvoice, readSelfAction) {
        return readSelfAction.countUnits(toInvoice);
    }).then(function(countUnits) {
        return countUnits;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    var me = this;
    return Q().then(function() {
        return me.reported.where({
            $ne : [ 
                {
                    $ne : [ 
                        { invoice : null },
                        true
                    ]
                },
                true
            ]
        });
    });
};
/*************************** PRIVATE OPS ***********************/

taskSchema.methods.countUnits = function (work) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return Q.npost(require('./Work.js'), 'findOne', [ ({ _id : work._id }) ]);
        }).then(function(work) {
            return Q.npost(require('./Work.js').aggregate()
                          .group({ _id: null, result: { $sum: '$units' } })
                          .select('-id result'), 'exec', [  ])
            ;
        });
    }).then(function() {
        return Q().then(function() {
            ;
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
