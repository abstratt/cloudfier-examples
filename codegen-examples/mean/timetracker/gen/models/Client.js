var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var clientSchema = new Schema({
    name : {
        type : String,
        required : true
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
    var newTask = new require('./Task.js') ();
    newTask.description = description;
    // link client and tasks
    newTask.client = this;
    this.tasks.push(newTask);
    return newTask;
};

clientSchema.methods.startInvoice = function () {
    var newInvoice = new require('./Invoice.js') ();
    // link client and invoices
    newInvoice.client = this;
    this.invoices.push(newInvoice);
    return newInvoice;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
