var Q = require("q");
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
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("newIssue = new Issue();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newIssue = new Issue();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newIssue['summary'] = summary;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newIssue['summary'] = summary;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newIssue['description'] = description;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newIssue['description'] = description;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newIssue['severity'] = severity;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newIssue['severity'] = severity;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newIssue['reporter'] = User['current'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newIssue['reporter'] = User['current'];
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newIssue['project'] = project;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newIssue['project'] = project;
        });
    }).then(function() {
        return Q.all([
            Q.when(function() {
                console.log("return newIssue['issueKey'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return newIssue['issueKey'];
            }),
            Q.when(function() {
                console.log("return summary;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return summary;
            }),
            Q.when(function() {
                console.log("return description;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return description;
            }),
            Q.when(function() {
                console.log("return User.findOne({ _id : newIssue.reporter }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return User.findOne({ _id : newIssue.reporter }).exec();
            }).then(function(read_reporter) {
                return read_reporter['email'];
            }),
            Q.when(function() {
                console.log("return newIssue['userNotifier'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return newIssue['userNotifier'];
            })
        ]).spread(function(read_issueKey, read_Summary, read_Description, read_email, read_userNotifier) {
            read_userNotifier.issueReported(read_issueKey, read_Summary, read_Description, read_email)
            return Q.when(null);
        });
    });
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    var me = this;
    return Q.when(function() {
        console.log("me['assignee'] = null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['assignee'] = null;
    });
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    var me = this;
    return Q.when(function() {
        console.log("me['assignee'] = newAssignee;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['assignee'] = newAssignee;
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
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("me['resolvedOn'] = new Date();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            me['resolvedOn'] = new Date();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("me['resolution'] = resolution;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            me['resolution'] = resolution;
        });
    });
};

/**
 *  Reopen the issue. 
 */
issueSchema.methods.reopen = function (reason) {
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("me['resolvedOn'] = null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            me['resolvedOn'] = null;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("me['resolution'] = null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            me['resolution'] = null;
        });
    }).then(function() {
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("return reason !== <Q><Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return reason !== "";
            });
        }).then(function() {
            return Q.when(function() {
                console.log("me.comment(reason);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                me.comment(reason);
            });
        });
    });
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    var me = this;
    return Q.when(function() {
        console.log("me.addComment(text, null);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me.addComment(text, null);
    });
};

issueSchema.methods.addWatcher = function (userToAdd) {
    var me = this;
    return Q.when(function() {
        console.log("// link issuesWatched and watchers<NL>userToAdd.issuesWatched.push(me);<NL>me.watchers.push(userToAdd);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        // link issuesWatched and watchers
        userToAdd.issuesWatched.push(me);
        me.watchers.push(userToAdd);
    });
};

issueSchema.methods.vote = function () {
    var me = this;
    return Q.when(function() {
        console.log("// link voted and voters<NL>User['current'].voted.push(me);<NL>me.voters.push(User['current']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        // link voted and voters
        User['current'].voted.push(me);
        me.voters.push(User['current']);
    });
};

issueSchema.methods.withdrawVote = function () {
    var me = this;
    return Q.when(function() {
        console.log("me.voters = null;<NL>me = null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me.voters = null;
        me = null;
    });
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    var me = this;
    return Q.when(function() {
        console.log("me['assignee'] = User['current'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['assignee'] = User['current'];
    });
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    var me = this;
    return Q.when(function() {
        console.log("me['assignee'] = User['current'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['assignee'] = User['current'];
    });
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    var me = this;
    return Q.when(function() {
        console.log(";".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        ;
    });
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Issue').find().where({ severity : toMatch }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Issue').find().where({ severity : toMatch }).exec();
    });
};

issueSchema.statics.byStatus = function (toMatch) {
    var me = this;
    return Q.when(function() {
        console.log("return Issue.filterByStatus(this.model('Issue').find(), toMatch);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Issue.filterByStatus(this.model('Issue').find(), toMatch);
    }).then(function(call_filterByStatus) {
        return call_filterByStatus.exec();
    });
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.virtual('issueKey').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return Project.findOne({ _id : me.project }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Project.findOne({ _id : me.project }).exec();
    }).then(function(read_project) {
        return read_project['token'] + "-" + me['issueId'];
    });
});

issueSchema.virtual('votes').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return User.find({ voted : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return User.find({ voted : me._id }).exec();
    }).then(function(readLinkAction) {
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
    var me = this;
    return Q.when(function() {
        console.log("return User.findOne({ _id : me.assignee }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return User.findOne({ _id : me.assignee }).exec();
    }).then(function(read_assignee) {
        return User['current'] == read_assignee;
    });
});

issueSchema.virtual('free').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return User.findOne({ _id : me.assignee }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return User.findOne({ _id : me.assignee }).exec();
        }),
        Q.when(function() {
            console.log("return null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
    var me = this;
    return Q.when(function() {
        console.log("return issues.where({ status : toMatch }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return issues.where({ status : toMatch }).exec();
    });
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    var comment;
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("comment = new Comment();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            comment = new Comment();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("comment['user'] = User['current'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            comment['user'] = User['current'];
        });
    }).then(function() {
        return Q.when(function() {
            console.log("comment['commentedOn'] = new Date();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            comment['commentedOn'] = new Date();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("comment['text'] = text;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            comment['text'] = text;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("comment['inReplyTo'] = inReplyTo;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            comment['inReplyTo'] = inReplyTo;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("// link issue and comments<NL>comment.issue = me;<NL>me.comments.push(comment);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            // link issue and comments
            comment.issue = me;
            me.comments.push(comment);
        });
    }).then(function() {
        return Q.all([
            Q.when(function() {
                console.log("return me['issueKey'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return me['issueKey'];
            }),
            Q.when(function() {
                console.log("return User.findOne({ _id : comment.user }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return User.findOne({ _id : comment.user }).exec();
            }).then(function(read_user) {
                return read_user['email'];
            }),
            Q.when(function() {
                console.log("return User.findOne({ _id : me.reporter }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return User.findOne({ _id : me.reporter }).exec();
            }).then(function(read_reporter) {
                return read_reporter['email'];
            }),
            Q.when(function() {
                console.log("return text;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return text;
            }),
            Q.when(function() {
                console.log("return me['userNotifier'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return me['userNotifier'];
            })
        ]).spread(function(read_issueKey, read_email, read_email, read_Text, read_userNotifier) {
            read_userNotifier.commentAdded(read_issueKey, read_email, read_email, read_Text)
            return Q.when(null);
        });
    });
};
/*************************** STATE MACHINE ********************/
issueSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+"): "+ this);
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
    console.log("completed handleEvent("+ event+"): "+ this);
    
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
