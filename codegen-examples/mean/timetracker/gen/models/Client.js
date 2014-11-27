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

/*************************** ACTIONS ***************************/

clientSchema.methods.newTask = function (description) {
    var newTask;
    var me = this;
    return Q().then(function() {
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
            console.log("return Q.npost(newTask, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(newTask, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
        });
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(newTask, 'save', [  ]);
            })
        ]);
    });
};

clientSchema.methods.startInvoice = function () {
    var newInvoice;
    var me = this;
    return Q().then(function() {
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
            console.log("return Q.npost(newInvoice, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(newInvoice, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
        });
    }).then(function() { 
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(newInvoice, 'save', [  ]);
            })
        ]);
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
