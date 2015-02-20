var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Client = require('./Client.js');
var Invoice = require('./Invoice.js');
var Work = require('./Work.js');

// declare schema
var taskSchema = new Schema({
    description : {
        type : String,
        "default" : null
    },
    reported : [{
        type : Schema.Types.ObjectId,
        ref : "Work",
        "default" : []
    }],
    client : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    }
});


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
        return Q.npost(require('./Work.js'), 'find', [ ({ task : me._id }) ]);
    }).then(function(reported) {
        return <UNSUPPORTED: Activity> >;
    }).then(function(sumResult) {
        return sumResult;
    });
};

taskSchema.methods.getUnitsToInvoice = function () {
    var me = this;
    return Q().then(function() {
        return me.getToInvoice();
    }).then(function(toInvoice) {
        return <UNSUPPORTED: Activity> >;
    }).then(function(sumResult) {
        return sumResult;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Work.js'), 'find', [ ({ task : me._id }) ]);
    }).then(function(reported) {
        return reported.where({
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
    }).then(function(selectResult) {
        return selectResult;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
