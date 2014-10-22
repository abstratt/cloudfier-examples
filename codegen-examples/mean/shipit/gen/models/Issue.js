var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Label = require('./Label.js');
var Project = require('./Project.js');

/**
 * An issue describes a problem report, a feature request or just a work item for a project. Issues are reported by and
 * assigned to users, and go through a lifecycle from the time they are opened until they are resolved and eventually
 * closed. 
 */
// declare schema
var issueSchema = new Schema({
    summary : {
        type : String,
        required : true,
        default : null
    },
    reportedOn : {
        type : Date,
        default : (function() {
            return new Date();
        })()
    },
    severity : {
        type : String,
        required : true,
        enum : ["Minor", "Normal", "Major", "Blocker", "Enhancement"],
        default : "Major"
    },
    status : {
        type : String,
        enum : ["Open", "InProgress", "Assigned", "Resolved", "Verified"],
        default : "Open"
    },
    resolution : {
        type : String,
        enum : ["Fixed", "WorksForMe", "WontFix"],
        default : "Fixed"
    },
    resolvedOn : {
        type : Date,
        default : new Date()
    },
    description : {
        type : String,
        required : true,
        default : null
    },
    labels : [{
        type : Schema.Types.ObjectId,
        ref : "Label"
    }],
    project : {
        type : Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },
    reporter : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    assignee : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    watchers : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }],
    voters : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }],
    comments : [{
        text : {
            type : String,
            default : null
        },
        commentedOn : {
            type : Date,
            default : (function() {
                return new Date();
            })()
        },
        user : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        inReplyTo : {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        }
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Report a new issue. 
 */
issueSchema.statics.reportIssue = function (project, summary, description, severity) {
    var precondition = function() {
        return User.provisioned;
    };
    if (!precondition.call(this)) {
        throw "Precondition on reportIssue was violated"
    }
    var newIssue;
    newIssue = new Issue();
    newIssue.summary = summary;
    newIssue.description = description;
    newIssue.severity = severity;
    newIssue.reporter = User.current;
    newIssue.project = project;
    /*newIssue.userNotifier.issueReported(newIssue.issueKey, summary, description, newIssue.reporter.email)*/;
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    var precondition = function() {
        return this.mine;
    };
    if (!precondition.call(this)) {
        throw "Precondition on release was violated"
    }
    this.assignee = null;
    this.handleEvent('release');
    return this.save();
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    var precondition = function() {
        return this.mine || this.free;
    };
    if (!precondition.call(this)) {
        throw "Precondition on assign was violated"
    }
    this.assignee = newAssignee;
    this.handleEvent('assign');
    return this.save();
};

/**
 *  Suspend work on this issue. 
 */
issueSchema.methods.suspend = function () {
    var precondition = function() {
        return this.mine;
    };
    if (!precondition.call(this)) {
        throw "Precondition on suspend was violated"
    }
    this.handleEvent('suspend');    
};

/**
 *  Start/resume work on this issue. 
 */
issueSchema.methods.start = function () {
    var precondition = function() {
        return this.mine;
    };
    if (!precondition.call(this)) {
        throw "Precondition on start was violated"
    }
    this.handleEvent('start');    
};

/**
 *  Resolve the issue. 
 */
issueSchema.methods.resolve = function (resolution) {
    var precondition = function() {
        return this.mine || this.free;
    };
    if (!precondition.call(this)) {
        throw "Precondition on resolve was violated"
    }
    this.resolvedOn = new Date();
    this.resolution = resolution;
    this.handleEvent('resolve');
    return this.save();
};

/**
 *  Reopen the issue. 
 */
issueSchema.methods.reopen = function (reason) {
    this.resolvedOn = null;
    this.resolution = null;
    if (reason !== "") {
        this.comment(reason);
    }
    this.handleEvent('reopen');
    return this.save();
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    this.addComment(text, null);
    this.handleEvent('comment');
    return this.save();
};

issueSchema.methods.addWatcher = function (userToAdd) {
    // link issuesWatched and watchers
    userToAdd.issuesWatched.push(this);
    this.watchers.push(userToAdd);
    this.handleEvent('addWatcher');
    return this.save();
};

issueSchema.methods.vote = function () {
    var precondition = function() {
        return !User.current == null;
    };
    if (!precondition.call(this)) {
        throw "Precondition on vote was violated"
    }
    var precondition = function() {
        return !this.mine;
    };
    if (!precondition.call(this)) {
        throw "Precondition on vote was violated"
    }
    var precondition = function() {
        return !includes;
    };
    if (!precondition.call(this)) {
        throw "Precondition on vote was violated"
    }
    // link voted and voters
    User.current.voted.push(this);
    this.voters.push(User.current);
    this.handleEvent('vote');
    return this.save();
};

issueSchema.methods.withdrawVote = function () {
    var precondition = function() {
        return !User.current == null;
    };
    if (!precondition.call(this)) {
        throw "Precondition on withdrawVote was violated"
    }
    var precondition = function() {
        return includes;
    };
    if (!precondition.call(this)) {
        throw "Precondition on withdrawVote was violated"
    }
    this.voters = null;
    this = null;
    this.handleEvent('withdrawVote');
    return this.save();
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    var precondition = function() {
        return User.current.committer;
    };
    if (!precondition.call(this)) {
        throw "Precondition on assignToMe was violated"
    }
    var precondition = function() {
        return !this.mine;
    };
    if (!precondition.call(this)) {
        throw "Precondition on assignToMe was violated"
    }
    this.assignee = User.current;
    this.handleEvent('assignToMe');
    return this.save();
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    var precondition = function() {
        return User.current.committer;
    };
    if (!precondition.call(this)) {
        throw "Precondition on steal was violated"
    }
    var precondition = function() {
        return !this.mine;
    };
    if (!precondition.call(this)) {
        throw "Precondition on steal was violated"
    }
    this.assignee = User.current;
    this.handleEvent('steal');
    return this.save();
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    this.handleEvent('verify');
    return this.save();
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    return Issue.find().where('severity').eq(toMatch).exec();
};

issueSchema.statics.byStatus = function (toMatch) {
    return Issue.filterByStatus(Issue.find(), toMatch).exec();
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.virtual('issueKey').get(function () {
    return this.project.token + "-" + this.issueId;
});

issueSchema.virtual('votes').get(function () {
    return count;
});

issueSchema.virtual('commentCount').get(function () {
    return count;
});

issueSchema.virtual('waitingFor').get(function () {
    return "" + (this.referenceDate() - this.reportedOn) / (1000*60*60*24) + " day(s)";
});

issueSchema.virtual('mine').get(function () {
    return User.current == this.assignee;
});

issueSchema.virtual('free').get(function () {
    return this.assignee == null;
});
/*************************** PRIVATE OPS ***********************/

issueSchema.methods.referenceDate = function () {
    if (this.resolvedOn == null) {
        return new Date().exec();
    } else  {
        return this.resolvedOn.exec();
    }
};

issueSchema.statics.filterByStatus = function (issues, toMatch) {
    return issues.where('status').eq(toMatch).exec();
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    var comment;
    comment = new Comment();
    comment.user = User.current;
    comment.commentedOn = new Date();
    comment.text = text;
    comment.inReplyTo = inReplyTo;
    // link issue and comments
    comment.issue = this;
    this.comments.push(comment);
    /*this.userNotifier.commentAdded(this.issueKey, comment.user.email, this.reporter.email, text)*/;
};
/*************************** STATE MACHINE ********************/
issueSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'resolve' :
            if (this.status == 'Open') {
                this.status = 'Resolved';
                return;
            }
            if (this.status == 'Assigned') {
                this.status = 'Resolved';
                return;
            }
            break;
        
        case 'assignToMe' :
            if (this.status == 'Open') {
                this.status = 'Assigned';
                return;
            }
            break;
        
        case 'assign' :
            if (this.status == 'Open') {
                this.status = 'Assigned';
                return;
            }
            break;
        
        case 'suspend' :
            if (this.status == 'InProgress') {
                this.status = 'Assigned';
                return;
            }
            break;
        
        case 'release' :
            if (this.status == 'Assigned') {
                this.status = 'Open';
                return;
            }
            break;
        
        case 'steal' :
            if (this.status == 'Assigned') {
                this.status = 'Assigned';
                return;
            }
            break;
        
        case 'start' :
            if (this.status == 'Assigned') {
                this.status = 'InProgress';
                return;
            }
            break;
        
        case 'verify' :
            if (this.status == 'Resolved') {
                this.status = 'Verified';
                return;
            }
            break;
        
        case 'reopen' :
            if (this.status == 'Verified') {
                this.status = 'Open';
                return;
            }
            break;
    }
};


// declare model on the schema
var exports = module.exports = mongoose.model('Issue', issueSchema);
