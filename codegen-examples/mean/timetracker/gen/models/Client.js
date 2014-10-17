var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

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
var Client = mongoose.model('Client', clientSchema);

/*************************** ACTIONS ***************************/

clientSchema.methods.newTask = function (description) {
    var newTask = new Task();
    newTask.description = description;
    // link client and tasks
    newTask.client = this;
    this.tasks.push(newTask);
    return newTask;
};

clientSchema.methods.startInvoice = function () {
    var newInvoice = new Invoice();
    // link client and invoices
    newInvoice.client = this;
    this.invoices.push(newInvoice);
    return newInvoice;
};

var exports = module.exports = Client;
