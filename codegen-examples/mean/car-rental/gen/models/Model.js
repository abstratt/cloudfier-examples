var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var modelSchema = new Schema({
    name : {
        type : String
    },
    make : {
        type : Schema.Types.ObjectId,
        ref : "Make"
    }
});

/*************************** DERIVED PROPERTIES ****************/

modelSchema.virtual('description').get(function () {
    return this.make.name + " " + this.name;
});

// declare model on the schema
var exports = module.exports = mongoose.model('Model', modelSchema);
