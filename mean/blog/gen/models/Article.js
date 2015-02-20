var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');

// declare schema
var articleSchema = new Schema({
    title : {
        type : String,
        "default" : null
    },
    body : {
        type : String,
        "default" : null
    },
    tags : {
        type : String,
        "default" : null
    },
    createdAt : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    comments : [{
        body : {
            type : String,
            "default" : null
        },
        createdAt : {
            type : Date,
            "default" : (function() {
                return new Date();
            })()
        },
        article : {
            type : Schema.Types.ObjectId,
            ref : "Article"
        },
        user : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }]
});



// declare model on the schema
var exports = module.exports = mongoose.model('Article', articleSchema);
