    var EventEmitter = require('events').EventEmitter;        

    var externalInvoicerSchema = new Schema({
    });
    
    
    
    
    
    var ExternalInvoicer = mongoose.model('ExternalInvoicer', externalInvoicerSchema);
    ExternalInvoicer.emitter = new EventEmitter();
