var q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Article = require('./Article.js');

// declare schema
var commentSchema = new Schema({
    body : {
        type : String,
        required : true,
        default : null
    },
    createdAt : {
        type : Date,
        default : (function() {
            return new Date();
        })()
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});


// declare model on the schema
var exports = module.exports = mongoose.model('Comment', commentSchema);
