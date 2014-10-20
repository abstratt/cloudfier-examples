var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
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


// declare model on the schema
var exports = module.exports = mongoose.model('Model', modelSchema);
