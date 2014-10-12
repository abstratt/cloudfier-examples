    var EventEmitter = require('events').EventEmitter;        

    var workScenariosSchema = new Schema({
    });
    
    
    
    
    
    var WorkScenarios = mongoose.model('WorkScenarios', workScenariosSchema);
    WorkScenarios.emitter = new EventEmitter();
