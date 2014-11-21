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
    var newIssue;
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            newIssue = new Issue();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newIssue['summary'] = summary;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newIssue['description'] = description;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newIssue['severity'] = severity;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newIssue['reporter'] = User['current'];
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newIssue['project'] = project;
        });
    }).then(function() {
        return q(/*parallel*/).all([
            q(/*leaf*/).then(function() {
                return newIssue['issueKey'];
            }), q(/*leaf*/).then(function() {
                return summary;
            }), q(/*leaf*/).then(function() {
                return description;
            }), q(/*leaf*/).then(function() {
                return User.find({ _id : newIssue.reporter }).exec();
            }).then(function(/*singleChild*/read_reporter) {
                return read_reporter['email'];
            }), q(/*leaf*/).then(function() {
                return newIssue['userNotifier'];
            })
        ]).spread(function(read_issueKey, read_Summary, read_Description, read_email, read_userNotifier) {
            read_userNotifier.issueReported(read_issueKey, read_Summary, read_Description, read_email);
        });
    });
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    return q(/*leaf*/).then(function() {
        this['assignee'] = null;
    });
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    return q(/*leaf*/).then(function() {
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
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            this['resolvedOn'] = new Date();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            this['resolution'] = resolution;
        });
    });
};

/**
 *  Reopen the issue. 
 */
issueSchema.methods.reopen = function (reason) {
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            this['resolvedOn'] = null;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            this['resolution'] = null;
        });
    }).then(function() {
        return q(/*sequential*/).then(function() {
            return q(/*leaf*/).then(function() {
                return reason !== "";
            });
        }).then(function() {
            return q(/*leaf*/).then(function() {
                this.comment(reason);
            });
        });
    });
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    return q(/*leaf*/).then(function() {
        this.addComment(text, null);
    });
};

issueSchema.methods.addWatcher = function (userToAdd) {
    return q(/*leaf*/).then(function() {
        // link issuesWatched and watchers
        userToAdd.issuesWatched.push(this);
        this.watchers.push(userToAdd);
    });
};

issueSchema.methods.vote = function () {
    return q(/*leaf*/).then(function() {
        // link voted and voters
        User['current'].voted.push(this);
        this.voters.push(User['current']);
    });
};

issueSchema.methods.withdrawVote = function () {
    return q(/*leaf*/).then(function() {
        this.voters = null;
        this = null;
    });
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    return q(/*leaf*/).then(function() {
        this['assignee'] = User['current'];
    });
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    return q(/*leaf*/).then(function() {
        this['assignee'] = User['current'];
    });
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    return q(/*leaf*/).then(function() {
        ;
    });
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    return q(/*leaf*/).then(function() {
        return this.model('Issue').find().where({ severity : toMatch }).exec();
    });
};

issueSchema.statics.byStatus = function (toMatch) {
    return q(/*leaf*/).then(function() {
        return Issue.filterByStatus(this.model('Issue').find(), toMatch);
    }).then(function(/*singleChild*/call_filterByStatus) {
        return call_filterByStatus.exec();
    });
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.virtual('issueKey').get(function () {
    return q(/*leaf*/).then(function() {
        return Project.find({ _id : this.project }).exec();
    }).then(function(/*singleChild*/read_project) {
        return read_project['token'] + "-" + this['issueId'];
    });
});

issueSchema.virtual('votes').get(function () {
    return q(/*leaf*/).then(function() {
        return User.find({ _id : this.voters }).exec();
    }).then(function(/*singleChild*/readLinkAction) {
        return /*TBD*/count;
    });
});

issueSchema.virtual('commentCount').get(function () {
    return /*TBD*/count;
});

issueSchema.virtual('waitingFor').get(function () {
    return "" + (this.referenceDate() - this['reportedOn']) / (1000*60*60*24) + " day(s)";
});

issueSchema.virtual('mine').get(function () {
    return q(/*leaf*/).then(function() {
        return User.find({ _id : this.assignee }).exec();
    }).then(function(/*singleChild*/read_assignee) {
        return User['current'] == read_assignee;
    });
});

issueSchema.virtual('free').get(function () {
    return q(/*parallel*/).all([
        q(/*leaf*/).then(function() {
            return User.find({ _id : this.assignee }).exec();
        }), q(/*leaf*/).then(function() {
            return null;
        })
    ]).spread(function(read_assignee, valueSpecificationAction) {
        return read_assignee == valueSpecificationAction;
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
    return q(/*leaf*/).then(function() {
        return issues.where({ status : toMatch }).exec();
    });
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    var comment;
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            comment = new Comment();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            comment['user'] = User['current'];
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            comment['commentedOn'] = new Date();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            comment['text'] = text;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            comment['inReplyTo'] = inReplyTo;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            // link issue and comments
            comment.issue = this;
            this.comments.push(comment);
        });
    }).then(function() {
        return q(/*parallel*/).all([
            q(/*leaf*/).then(function() {
                return this['issueKey'];
            }), q(/*leaf*/).then(function() {
                return User.findOne({ _id : comment.user }).exec();
            }).then(function(/*singleChild*/read_user) {
                return read_user['email'];
            }), q(/*leaf*/).then(function() {
                return User.find({ _id : this.reporter }).exec();
            }).then(function(/*singleChild*/read_reporter) {
                return read_reporter['email'];
            }), q(/*leaf*/).then(function() {
                return text;
            }), q(/*leaf*/).then(function() {
                return this['userNotifier'];
            })
        ]).spread(function(read_issueKey, read_email, read_email, read_Text, read_userNotifier) {
            read_userNotifier.commentAdded(read_issueKey, read_email, read_email, read_Text);
        });
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
