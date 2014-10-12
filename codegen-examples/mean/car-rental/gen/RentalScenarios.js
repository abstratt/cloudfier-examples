    var EventEmitter = require('events').EventEmitter;        

    var rentalScenariosSchema = new Schema({
    });
    
    
    
    
    
    var RentalScenarios = mongoose.model('RentalScenarios', rentalScenariosSchema);
    RentalScenarios.emitter = new EventEmitter();
