    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

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
    var Todo = mongoose.model('Todo', todoSchema);
    Todo.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    todoSchema.methods.complete = function () {
        this.status = "Done";
    };
    
    var exports = module.exports = Todo;
