    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var modelSchema = new Schema({
        name : {
            type : String,
            required : true
        },
        make : {
            type : Schema.Types.ObjectId,
            ref : "Make",
            required : true
        }
    });
    var Model = mongoose.model('Model', modelSchema);
    Model.emitter = new EventEmitter();
    
    
    var exports = module.exports = Model;
