var Q = require("q");
var mongoose = require('mongoose');    
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
            console.log("console.log(\"This: \");\nconsole.log(newWork);\nconsole.log(\"That: \");\nconsole.log(me);\nme.reported.push(newWork._id);\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(newWork);\nnewWork.task = me._id;\n");
            console.log("This: ");
            console.log(newWork);
            console.log("That: ");
            console.log(me);
            me.reported.push(newWork._id);
            console.log("This: ");
            console.log(me);
            console.log("That: ");
            console.log(newWork);
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
        return me.save();
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
        console.log("return me['reported'].where({\n    $ne : [ \n        { 'invoiced' : true },\n        true\n    ]\n});\n");
        return me['reported'].where({
            $ne : [ 
                { 'invoiced' : true },
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
