var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Comment = require('./Comment.js');

// declare schema
var articleSchema = new Schema({
    title : {
        type : String,
        required : true,
        default : null
    },
    body : {
        type : String,
        required : true,
        default : null
    },
    tags : {
        type : String,
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
    },
    comments : [{
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
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Article', articleSchema);
