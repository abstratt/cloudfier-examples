    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;

    var modelSchema = new Schema({
        description : String,
        name : String,
        make : { type: Schema.Types.ObjectId, ref: 'Make' }
    });
    var Model = mongoose.model('Model', modelSchema);
    Model.emitter = new EventEmitter();
    
    /*************************** DERIVED PROPERTIES ****************/
    
    modelSchema.methods.getDescription = function () {
        return this.make.name + " " + this.name;
    };
    
    var exports = module.exports = Model;
