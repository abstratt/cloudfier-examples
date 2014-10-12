    var EventEmitter = require('events').EventEmitter;        

    var carScenariosSchema = new Schema({
    });
    
    
    
    
    
    var CarScenarios = mongoose.model('CarScenarios', carScenariosSchema);
    CarScenarios.emitter = new EventEmitter();
