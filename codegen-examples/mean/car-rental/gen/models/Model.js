var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var modelSchema = new Schema({
    name : {
        type : String
    },
    make : {
        type : Schema.Types.ObjectId,
        ref : "Make"
    }
});
var Model = mongoose.model('Model', modelSchema);

/*************************** DERIVED PROPERTIES ****************/

modelSchema.virtual('description').get(function () {
    return this.make.name + " " + this.name;
});

var exports = module.exports = Model;
