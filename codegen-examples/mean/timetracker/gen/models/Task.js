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
                /*sync*/console.log("return new Date();");
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
            console.log("newWork = new Work();\n");
            newWork = new Work();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Integer, 'findOne', [ ({ _id : units._id }) ]);");
            return Q.npost(Integer, 'findOne', [ ({ _id : units._id }) ]);
        }).then(function(units) {
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
            console.log("return newWork;\n");
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
    console.log("this.unitsReported: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.countUnits(me.reported);");
        return me.countUnits(me.reported);
    }).then(function(countUnits) {
        console.log("return countUnits;\n");
        return countUnits;
    });
};

taskSchema.methods.getUnitsToInvoice = function () {
    console.log("this.unitsToInvoice: " + JSON.stringify(this));
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
        console.log("toInvoice:" + toInvoice);console.log("readSelfAction:" + readSelfAction);
        return readSelfAction.countUnits(toInvoice);
    }).then(function(countUnits) {
        console.log("return countUnits;\n");
        return countUnits;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.reported.where({\n    $ne : [ \n        {\n            $ne : [ \n                { invoice : null },\n                true\n            ]\n        },\n        true\n    ]\n});\n");
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
            console.log("return Q.npost(Work, 'findOne', [ ({ _id : work._id }) ]);");
            return Q.npost(Work, 'findOne', [ ({ _id : work._id }) ]);
        }).then(function(work) {
            console.log("return Q.npost(Work.aggregate()\n              .group({ _id: null, result: { $sum: '$units' } })\n              .select('-id result'), 'exec', [  ])\n;\n");
            return Q.npost(Work.aggregate()
                          .group({ _id: null, result: { $sum: '$units' } })
                          .select('-id result'), 'exec', [  ])
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log(";\n");
            ;
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
