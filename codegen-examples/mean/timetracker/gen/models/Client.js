var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Invoice = require('./Invoice.js');
var Task = require('./Task.js');

// declare schema
var clientSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    },
    tasks : [{
        type : Schema.Types.ObjectId,
        ref : "Task"
    }],
    invoices : [{
        type : Schema.Types.ObjectId,
        ref : "Invoice"
    }]
});

/*************************** ACTIONS ***************************/

clientSchema.methods.newTask = function (description) {
    var newTask;
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("newTask = new Task();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newTask = new Task();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newTask['description'] = description;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newTask['description'] = description;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("// link client and tasks<NL>newTask.client = me;<NL>me.tasks.push(newTask);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            // link client and tasks
            newTask.client = me;
            me.tasks.push(newTask);
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newTask.save();<NL>return q(newTask);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newTask.save();
            return q(newTask);
        });
    });
};

clientSchema.methods.startInvoice = function () {
    var newInvoice;
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("newInvoice = new Invoice();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newInvoice = new Invoice();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("// link client and invoices<NL>newInvoice.client = me;<NL>me.invoices.push(newInvoice);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            // link client and invoices
            newInvoice.client = me;
            me.invoices.push(newInvoice);
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newInvoice.save();<NL>return q(newInvoice);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newInvoice.save();
            return q(newInvoice);
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
