var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var userSchema = new Schema({
    email : {
        type : String
    },
    fullName : {
        type : String,
        required : true
    },
    kind : {
        type : String,
        enum : ["Reporter", "Committer"]
    },
    issuesReportedByUser : [{
        type : Schema.Types.ObjectId,
        ref : "Issue"
    }],
    voted : [{
        type : Schema.Types.ObjectId,
        ref : "Issue"
    }],
    issuesAssignedToUser : [{
        type : Schema.Types.ObjectId,
        ref : "Issue"
    }],
    issuesWatched : [{
        type : Schema.Types.ObjectId,
        ref : "Issue"
    }]
});
var User = mongoose.model('User', userSchema);

/*************************** ACTIONS ***************************/

userSchema.methods.promoteToCommitter = function () {
    this.kind = "Committer";
};
/*************************** QUERIES ***************************/

userSchema.statics.current = function () {
    return cls.getNamespace('currentUser').exec();
};
/*************************** DERIVED PROPERTIES ****************/

userSchema.virtual('committer').get(function () {
    return this.kind == "Committer";
});
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.method.getIssuesCurrentlyInProgress = function () {
    return Issue.filterByStatus(this.issuesAssignedToUser, null);
};

userSchema.method.getIssuesCurrentlyAssigned = function () {
    return Issue.filterByStatus(this.issuesAssignedToUser, null);
};

userSchema.static.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

var exports = module.exports = User;
