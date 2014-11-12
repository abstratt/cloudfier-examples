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
    return q().then(function() {
        var newTask;
        newTask = new Task();
        newTask['description'] = description;
        // link client and tasks
        newTask.client = this;
        this.tasks.push(newTask);
        return newTask.save();
    });
};

clientSchema.methods.startInvoice = function () {
    return q().then(function() {
        var newInvoice;
        newInvoice = new Invoice();
        // link client and invoices
        newInvoice.client = this;
        this.invoices.push(newInvoice);
        return newInvoice.save();
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
