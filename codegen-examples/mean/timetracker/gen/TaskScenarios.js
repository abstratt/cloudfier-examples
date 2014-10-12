    var EventEmitter = require('events').EventEmitter;        

    var taskScenariosSchema = new Schema({
    });
    
    
    
    
    
    var TaskScenarios = mongoose.model('TaskScenarios', taskScenariosSchema);
    TaskScenarios.emitter = new EventEmitter();
