    var EventEmitter = require('events').EventEmitter;        

    var modelSchema = new Schema({
        description : String,
        name : String
    });
    
    /*************************** DERIVED PROPERTIES ****************/
    
    modelSchema.methods.getDescription = function () {
        return this.make.name + " " + this.name;
    };
    var Model = mongoose.model('Model', modelSchema);
    Model.emitter = new EventEmitter();
