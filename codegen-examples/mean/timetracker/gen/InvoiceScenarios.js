    var EventEmitter = require('events').EventEmitter;        

    var invoiceScenariosSchema = new Schema({
    });
    
    
    
    
    
    var InvoiceScenarios = mongoose.model('InvoiceScenarios', invoiceScenariosSchema);
    InvoiceScenarios.emitter = new EventEmitter();
