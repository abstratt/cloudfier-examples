    var EventEmitter = require('events').EventEmitter;        

    var clientSchema = new Schema({
        name : String
    });
    
    /*************************** ACTIONS ***************************/
    
    clientSchema.methods.newTask = function (description) {
        newTask = new Task();
        newTask.description = description;
        this.client = newTask;
        return newTask;
    };
    
    clientSchema.methods.startInvoice = function () {
        newInvoice = new Invoice();
        this.client = newInvoice;
        return newInvoice;
    };
    
    
    
    
    var Client = mongoose.model('Client', clientSchema);
    Client.emitter = new EventEmitter();
