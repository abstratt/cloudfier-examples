var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Invoice = require('./Invoice.js');
var Task = require('./Task.js');

// declare schema
var clientSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    tasks : [{
        type : Schema.Types.ObjectId,
        ref : "Task",
        "default" : []
    }],
    invoices : [{
        type : Schema.Types.ObjectId,
        ref : "Invoice",
        "default" : []
    }]
});
//            clientSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

clientSchema.methods.newTask = function (description) {
    var newTask;
    var me = this;
    return /* Working set: [me] *//* Working set: [me, newTask] */Q().then(function() {
        return Q().then(function() {
            console.log("newTask = new Task();\n");
            newTask = new Task();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newTask['description'] = description;\n");
            newTask['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newTask.client = me._id;\nme.tasks.push(newTask._id);\n");
            newTask.client = me._id;
            me.tasks.push(newTask._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return newTask;\n");
            return newTask;
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(newTask, 'save', [  ]);
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

clientSchema.methods.startInvoice = function () {
    var newInvoice;
    var me = this;
    return /* Working set: [me] *//* Working set: [me, newInvoice] */Q().then(function() {
        return Q().then(function() {
            console.log("newInvoice = new Invoice();\n");
            newInvoice = new Invoice();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newInvoice.client = me._id;\nme.invoices.push(newInvoice._id);\n");
            newInvoice.client = me._id;
            me.invoices.push(newInvoice._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return newInvoice;\n");
            return newInvoice;
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(newInvoice, 'save', [  ]);
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

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
