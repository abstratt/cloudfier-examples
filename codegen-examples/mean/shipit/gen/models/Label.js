    var EventEmitter = require('events').EventEmitter;        

    var labelSchema = new Schema({
        name : String
    });
    
    var Label = mongoose.model('Label', labelSchema);
    Label.emitter = new EventEmitter();
