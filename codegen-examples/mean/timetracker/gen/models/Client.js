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
    var newTask = new Task();
    newTask.description = description;
    // link client and tasks
    newTask.client = this;
    this.tasks.push(newTask);
    return newTask;
    return this.save();
};

clientSchema.methods.startInvoice = function () {
    var newInvoice = new Invoice();
    // link client and invoices
    newInvoice.client = this;
    this.invoices.push(newInvoice);
    return newInvoice;
    return this.save();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
