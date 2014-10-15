    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    /**
     *  Issues are reported against a specific project. 
     */
    var projectSchema = new Schema({
        description : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        },
        issues : [{
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }]
    });
    var Project = mongoose.model('Project', projectSchema);
    Project.emitter = new EventEmitter();
    
    
    var exports = module.exports = Project;
