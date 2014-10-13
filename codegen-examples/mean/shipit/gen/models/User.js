    var EventEmitter = require('events').EventEmitter;        

    var userSchema = new Schema({
        username : String,
        fullName : String,
        email : String,
        kind : UserKind,
        committer : Boolean
    });
    
    /*************************** DERIVED PROPERTIES ****************/
    
    userSchema.methods.getEmail = function () {
        return this.username;
    };
    
    userSchema.statics.getCurrent = function () {
        return System.user();
    };
    
    userSchema.methods.getCommitter = function () {
        return this.kind == <UNSUPPORTED: InstanceValue> ;
    };
    
    userSchema.methods.getIssuesCurrentlyInProgress = function () {
        return Issue.filterByStatus(this.issuesAssignedToUser, null);
    };
    
    userSchema.methods.getIssuesCurrentlyAssigned = function () {
        return Issue.filterByStatus(this.issuesAssignedToUser, null);
    };
    
    userSchema.statics.getProvisioned = function () {
        return !(System.user() == null);
    };
    var User = mongoose.model('User', userSchema);
    User.emitter = new EventEmitter();
