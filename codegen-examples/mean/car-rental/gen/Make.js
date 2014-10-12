    var EventEmitter = require('events').EventEmitter;        

    var makeSchema = new Schema({
        name : String
    });
    
    
    
    
    
    var Make = mongoose.model('Make', makeSchema);
    Make.emitter = new EventEmitter();
