var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Meeting = require('./Meeting.js');

// declare schema
var presentationSchema = new Schema({
    title : {
        type : String,
        required : true,
        default : null
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


// declare model on the schema
var exports = module.exports = mongoose.model('Presentation', presentationSchema);
