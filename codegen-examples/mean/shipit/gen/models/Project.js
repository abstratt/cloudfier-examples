var mongoose = require('mongoose');    
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
        required : true,
        default : null
    },
    token : {
        type : String,
        required : true,
        default : null
    },
    issues : [{
        type : Schema.Types.ObjectId,
        ref : "Issue"
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Project', projectSchema);
