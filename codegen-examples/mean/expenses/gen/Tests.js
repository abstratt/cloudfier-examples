    var EventEmitter = require('events').EventEmitter;        

    var testsSchema = new Schema({
    });
    
    
    
    
    
    var Tests = mongoose.model('Tests', testsSchema);
    Tests.emitter = new EventEmitter();
