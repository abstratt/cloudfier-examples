var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Comment = require('./Comment.js');
var Article = require('./Article.js');

// declare schema
var userSchema = new Schema({
    email : {
        type : String,
        "default" : null
    },
    name : {
        type : String,
        "default" : null
    }
});


// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
