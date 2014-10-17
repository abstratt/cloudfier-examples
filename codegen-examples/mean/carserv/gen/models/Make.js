var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

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
var Make = mongoose.model('Make', makeSchema);


var exports = module.exports = Make;
