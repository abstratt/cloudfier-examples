    var EventEmitter = require('events').EventEmitter;
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
    Client.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    clientSchema.methods.newTask = function (description) {
        newTask = new Task();
        newTask.description = description;
        this.client = newTask;
        return newTask;
        this.handleEvent('newTask');
    };
    
    clientSchema.methods.startInvoice = function () {
        newInvoice = new Invoice();
        this.client = newInvoice;
        return newInvoice;
        this.handleEvent('startInvoice');
    };
    
    var exports = module.exports = Client;
