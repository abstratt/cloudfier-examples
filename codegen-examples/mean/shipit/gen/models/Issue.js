var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 * An issue describes a problem report, a feature request or just a work item for a project. Issues are reported by and
 * assigned to users, and go through a lifecycle from the time they are opened until they are resolved and eventually
 * closed. 
 */
var issueSchema = new Schema({
    summary : {
        type : String,
        required : true
    },
    reportedOn : {
        type : Date
    },
    severity : {
        type : String,
        required : true,
        enum : ["Minor", "Normal", "Major", "Blocker", "Enhancement"]
    },
    status : {
        type : String,
        enum : ["Open", "InProgress", "Assigned", "Resolved", "Verified"]
    },
    resolution : {
        type : String,
        enum : ["Fixed", "WorksForMe", "WontFix"]
    },
    resolvedOn : {
        type : Date
    },
    description : {
        type : String,
        required : true
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
            type : String
        },
        commentedOn : {
            type : Date
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
var Issue = mongoose.model('Issue', issueSchema);

/*************************** ACTIONS ***************************/

/**
 *  Report a new issue. 
 */
issueSchema.statics.reportIssue = function (project, summary, description, severity) {
    var newIssue = new Issue();
    newIssue.summary = summary;
    newIssue.description = description;
    newIssue.severity = severity;
    newIssue.reporter = User.current;
    newIssue.project = project;
    newIssue.userNotifier.issueReported(newIssue.issueKey, summary, description, newIssue.reporter.email);
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    this.assignee = null;
    this.handleEvent('release');
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    this.assignee = newAssignee;
    this.handleEvent('assign');
};

/**
 *  Suspend work on this issue. 
 */
issueSchema.methods.suspend = function () {
    this.handleEvent('suspend');    
};

/**
 *  Start/resume work on this issue. 
 */
issueSchema.methods.start = function () {
    this.handleEvent('start');    
};

/**
 *  Resolve the issue. 
 */
issueSchema.methods.resolve = function (resolution) {
    this.resolvedOn = new Date();
    this.resolution = resolution;
    this.handleEvent('resolve');
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
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    this.addComment(text, null);
    this.handleEvent('comment');
};

issueSchema.methods.addWatcher = function (userToAdd) {
    // link issuesWatched and watchers
    userToAdd.issuesWatched.push(this);
    this.watchers.push(userToAdd);
    this.handleEvent('addWatcher');
};

issueSchema.methods.vote = function () {
    // link voted and voters
    User.current.voted.push(this);
    this.voters.push(User.current);
    this.handleEvent('vote');
};

issueSchema.methods.withdrawVote = function () {
    this.voters = null;
    this = null;
    this.handleEvent('withdrawVote');
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    this.assignee = User.current;
    this.handleEvent('assignToMe');
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    this.assignee = User.current;
    this.handleEvent('steal');
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    this.handleEvent('verify');
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    return this.model('Issue').find().where('severity').eq(toMatch).exec();
};

issueSchema.statics.byStatus = function (toMatch) {
    return Issue.filterByStatus(this.model('Issue').find(), toMatch).exec();
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
        return new Date();
    } else  {
        return this.resolvedOn;
    }
    this.handleEvent('referenceDate');
};

issueSchema.statics.filterByStatus = function (issues, toMatch) {
    return issues.where('status').eq(toMatch);
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    var comment = new Comment();
    comment.user = User.current;
    comment.commentedOn = new Date();
    comment.text = text;
    comment.inReplyTo = inReplyTo;
    // link issue and comments
    comment.issue = this;
    this.comments.push(comment);
    this.userNotifier.commentAdded(this.issueKey, comment.user.email, this.reporter.email, text);
    this.handleEvent('addComment');
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


var exports = module.exports = Issue;
