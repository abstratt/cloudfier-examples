var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var labelSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    labeled : [{
        type : Schema.Types.ObjectId,
        ref : "Issue"
    }]
});
var Label = mongoose.model('Label', labelSchema);


var exports = module.exports = Label;
