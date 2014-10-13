    var EventEmitter = require('events').EventEmitter;        

    var workSchema = new Schema({
        units : Number,
        date : Date,
        memo : String,
        invoiced : Boolean
    });
    
    /*************************** ACTIONS ***************************/
    
    /**
     *  Submits this work to a chosen invoice for the client. 
     */
    workSchema.methods.submit = function (invoice) {
        this.invoice = invoice;
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    workSchema.methods.getClient = function () {
        return this.task.client;
    };
    
    workSchema.methods.getInvoiced = function () {
        return !(this.invoice == null);
    };
    var Work = mongoose.model('Work', workSchema);
    Work.emitter = new EventEmitter();
