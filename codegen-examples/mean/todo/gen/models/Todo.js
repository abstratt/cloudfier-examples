var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');

// declare schema
var todoSchema = new Schema({
    description : {
        type : String,
        required : true,
        default : null
    },
    details : {
        type : String,
        required : true,
        default : null
    },
    status : {
        type : String,
        required : true,
        enum : ["Open", "Done", "Cancelled"],
        default : "Open"
    },
    assignee : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    creator : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    comments : [{
        text : {
            type : String,
            required : true,
            default : null
        },
        commenter : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }]
});

/*************************** ACTIONS ***************************/

todoSchema.methods.complete = function () {
    // isAsynchronous: true        
    console.log("this.status = 'Done'");
    this.status = "Done";
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Todo', todoSchema);
