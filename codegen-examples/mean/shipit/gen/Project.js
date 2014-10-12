    var EventEmitter = require('events').EventEmitter;        

    /**
     *  Issues are reported against a specific project. 
     */
    var projectSchema = new Schema({
        description : String,
        token : String
    });
    
    
    
    
    
    var Project = mongoose.model('Project', projectSchema);
    Project.emitter = new EventEmitter();
