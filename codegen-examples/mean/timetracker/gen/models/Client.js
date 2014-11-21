var q = require("q");
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
    return q().then(function() {
        return q().then(function() {
            newTask = new Task();
        });
    }).then(function() {
        return q().then(function() {
            newTask['description'] = description;
        });
    }).then(function() {
        return q().then(function() {
            // link client and tasks
            newTask.client = this;
            this.tasks.push(newTask);
        });
    }).then(function() {
        return q().then(function() {
            newTask.save();
            return q(newTask);
        });
    });
};

clientSchema.methods.startInvoice = function () {
    var newInvoice;
    return q().then(function() {
        return q().then(function() {
            newInvoice = new Invoice();
        });
    }).then(function() {
        return q().then(function() {
            // link client and invoices
            newInvoice.client = this;
            this.invoices.push(newInvoice);
        });
    }).then(function() {
        return q().then(function() {
            newInvoice.save();
            return q(newInvoice);
        });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
