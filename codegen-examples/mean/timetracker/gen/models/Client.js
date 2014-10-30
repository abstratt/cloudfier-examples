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
    // isAsynchronous: true        
    var newTask;
    console.log("newTask = new Task()");
    newTask = new Task();
    
    console.log("newTask.description = description");
    newTask.description = description;
    
    console.log("// link client and tasksnnewTask.client = this;nthis.tasks.push(newTask)");
    // link client and tasks
    newTask.client = this;
    this.tasks.push(newTask);
    
    console.log("return newTask");
    return newTask;
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

clientSchema.methods.startInvoice = function () {
    // isAsynchronous: true        
    var newInvoice;
    console.log("newInvoice = new Invoice()");
    newInvoice = new Invoice();
    
    console.log("// link client and invoicesnnewInvoice.client = this;nthis.invoices.push(newInvoice)");
    // link client and invoices
    newInvoice.client = this;
    this.invoices.push(newInvoice);
    
    console.log("return newInvoice");
    return newInvoice;
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Client', clientSchema);
