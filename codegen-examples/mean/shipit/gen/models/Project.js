var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Label = require('./Label.js');
var Issue = require('./Issue.js');

/**
 *  Issues are reported against a specific project. 
 */
// declare schema
var projectSchema = new Schema({
    description : {
        type : String,
        "default" : null
    },
    token : {
        type : String,
        "default" : null
    },
    issues : [{
        type : Schema.Types.ObjectId,
        ref : "Issue",
        "default" : []
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Project', projectSchema);
