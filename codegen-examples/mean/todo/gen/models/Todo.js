var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var todoSchema = new Schema({
    description : {
        type : String,
        required : true
    },
    details : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : ["Open", "Done", "Cancelled"]
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
            required : true
        },
        commenter : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }]
});

/*************************** ACTIONS ***************************/

todoSchema.methods.complete = function () {
    this.status = "Done";
};

// declare model on the schema
var exports = module.exports = mongoose.model('Todo', todoSchema);
