    var EventEmitter = require('events').EventEmitter;        

    var commentSchema = new Schema({
        commented : String,
        on : Date
    });
    
    /*************************** ACTIONS ***************************/
    
    commentSchema.methods.reply = function (text) {
        this.issue.addComment(text, this);
    };
    var Comment = mongoose.model('Comment', commentSchema);
    Comment.emitter = new EventEmitter();
