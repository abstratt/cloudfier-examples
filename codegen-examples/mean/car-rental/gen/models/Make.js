var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var makeSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    models : [{
        type : Schema.Types.ObjectId,
        ref : "Model"
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Make', makeSchema);
