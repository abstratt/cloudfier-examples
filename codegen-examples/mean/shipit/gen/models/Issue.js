var q = require("q");
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
    return q().all([q().then(function() {
        return newIssue['issueKey'];
    }), q().then(function() {
        return User.find({ _id : newIssue.reporter }).exec();
    })]).spread(function(issueKey, reporter) {
        var newIssue;
        newIssue = new Issue();
        newIssue['summary'] = summary;
        newIssue['description'] = description;
        newIssue['severity'] = severity;
        newIssue['reporter'] = User['current'];
        newIssue['project'] = project;
        newIssue['userNotifier'].issueReported(issueKey, summary, description, reporter['email']);
    });
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    return q().then(function() {
        this['assignee'] = null;
    });
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    return q().then(function() {
        this['assignee'] = newAssignee;
    });
};

/**
 *  Suspend work on this issue. 
 */
issueSchema.methods.suspend = function () {
};

/**
 *  Start/resume work on this issue. 
 */
issueSchema.methods.start = function () {
};

/**
 *  Resolve the issue. 
 */
issueSchema.methods.resolve = function (resolution) {
    return q().then(function() {
        this['resolvedOn'] = new Date();
        this['resolution'] = resolution;
    });
};

/**
 *  Reopen the issue. 
 */
issueSchema.methods.reopen = function (reason) {
    return q().then(function() {
        this.comment(reason)
    }).then(function(comment) {
        this['resolvedOn'] = null;
        this['resolution'] = null;
        if (reason !== "") {
            comment;
        }
    });
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    return q().then(function() {
        this.addComment(text, null)
    }).then(function(addComment) {
        addComment;
    });
};

issueSchema.methods.addWatcher = function (userToAdd) {
    return q().then(function() {
        // link issuesWatched and watchers
        userToAdd.issuesWatched.push(this);
        this.watchers.push(userToAdd);
    });
};

issueSchema.methods.vote = function () {
    return q().then(function() {
        // link voted and voters
        User['current'].voted.push(this);
        this.voters.push(User['current']);
    });
};

issueSchema.methods.withdrawVote = function () {
    return q().then(function() {
        this.voters = null;
        this = null;
    });
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    return q().then(function() {
        this['assignee'] = User['current'];
    });
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    return q().then(function() {
        this['assignee'] = User['current'];
    });
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    return q().then(function() {
    });
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    return this.model('Issue').find().where({ severity : toMatch }).exec();
};

issueSchema.statics.byStatus = function (toMatch) {
    return Issue.filterByStatus(this.model('Issue').find(), toMatch).exec();
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.virtual('issueKey').get(function () {
    return q().then(function() {
        return Project.find({ _id : this.project }).exec();
    }).then(function(project) {
        return project['token'] + "-" + this['issueId'];
    });
});

issueSchema.virtual('votes').get(function () {
    return q().then(function() {
        return User.find({ _id : this.voters }).exec();
    }).then(function(readLinkAction) {
        return count;
    });
});

issueSchema.virtual('commentCount').get(function () {
    return count;
});

issueSchema.virtual('waitingFor').get(function () {
    return "" + (this.referenceDate() - this['reportedOn']) / (1000*60*60*24) + " day(s)";
});

issueSchema.virtual('mine').get(function () {
    return q().then(function() {
        return User.find({ _id : this.assignee }).exec();
    }).then(function(assignee) {
        return User['current'] == assignee;
    });
});

issueSchema.virtual('free').get(function () {
    return q().then(function() {
        return User.find({ _id : this.assignee }).exec();
    }).then(function(assignee) {
        return assignee == null;
    });
});
/*************************** PRIVATE OPS ***********************/

issueSchema.methods.referenceDate = function () {
    if (this['resolvedOn'] == null) {
        return new Date().exec();
    } else  {
        return this['resolvedOn'].exec();
    }
};

issueSchema.statics.filterByStatus = function (issues, toMatch) {
    return issues.where({ status : toMatch }).exec();
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    return q().all([q().then(function() {
        return this['issueKey'];
    }), q().then(function() {
        return User.findOne({ _id : comment.user }).exec();
    }), q().then(function() {
        return User.find({ _id : this.reporter }).exec();
    })]).spread(function(issueKey, user, reporter) {
        var comment;
        comment = new Comment();
        comment['user'] = User['current'];
        comment['commentedOn'] = new Date();
        comment['text'] = text;
        comment['inReplyTo'] = inReplyTo;
        // link issue and comments
        comment.issue = this;
        this.comments.push(comment);
        this['userNotifier'].commentAdded(issueKey, user['email'], reporter['email'], text);
    });
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

issueSchema.methods.resolve = function () {
    this.handleEvent('resolve');
};
issueSchema.methods.assignToMe = function () {
    this.handleEvent('assignToMe');
};
issueSchema.methods.assign = function () {
    this.handleEvent('assign');
};
issueSchema.methods.suspend = function () {
    this.handleEvent('suspend');
};
issueSchema.methods.release = function () {
    this.handleEvent('release');
};
issueSchema.methods.steal = function () {
    this.handleEvent('steal');
};
issueSchema.methods.start = function () {
    this.handleEvent('start');
};
issueSchema.methods.verify = function () {
    this.handleEvent('verify');
};
issueSchema.methods.reopen = function () {
    this.handleEvent('reopen');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Issue', issueSchema);
