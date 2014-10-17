var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var presentationSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    meeting : {
        type : Schema.Types.ObjectId,
        ref : "Meeting",
        required : true
    }
});
var Presentation = mongoose.model('Presentation', presentationSchema);


var exports = module.exports = Presentation;
