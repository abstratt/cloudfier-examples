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

/*************************** ACTIONS ***************************/

taskSchema.methods.addWork = function (units) {
    var newWork;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("newWork = new Work();\n");
            newWork = new Work();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newWork['units'] = units;\n");
            newWork['units'] = units;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("me.reported.push(newWork._id);\nnewWork.task = me._id;\n");
            me.reported.push(newWork._id);
            newWork.task = me._id;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(newWork, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(newWork, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
        });
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(newWork, 'save', [  ]);
            })
        ]);
    });
};
/*************************** DERIVED PROPERTIES ****************/

taskSchema.virtual('unitsReported').get(function () {
    return this.countUnits(this['reported']);
});

taskSchema.virtual('unitsToInvoice').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return me.getToInvoice();");
            return me.getToInvoice();
        }),
        Q().then(function() {
            console.log("return me;");
            return me;
        })
    ]).spread(function(toInvoice, readSelfAction) {
        return readSelfAction.countUnits(toInvoice);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me['reported'].where({\n    $ne : [ \n        {\n            $ne : [ \n                { invoice : null },\n                true\n            ]\n        },\n        true\n    ]\n});\n");
        return me['reported'].where({
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
    return Q.npost(Work.aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result'), 'exec', [  ])
    ;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
