    var EventEmitter = require('events').EventEmitter;        

    var customerScenariosSchema = new Schema({
    });
    
    
    
    
    
    var CustomerScenarios = mongoose.model('CustomerScenarios', customerScenariosSchema);
    CustomerScenarios.emitter = new EventEmitter();
