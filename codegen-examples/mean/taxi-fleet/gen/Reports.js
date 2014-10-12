    var EventEmitter = require('events').EventEmitter;        

    var reportsSchema = new Schema({
    });
    
    
    
    
    
    var Reports = mongoose.model('Reports', reportsSchema);
    Reports.emitter = new EventEmitter();
