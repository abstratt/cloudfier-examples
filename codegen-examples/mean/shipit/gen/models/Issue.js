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
        "default" : null
    },
    reportedOn : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    severity : {
        type : String,
        enum : ["Minor", "Normal", "Major", "Blocker", "Enhancement"],
        "default" : "Major"
    },
    status : {
        type : String,
        enum : ["Open", "InProgress", "Assigned", "Resolved", "Verified"],
        "default" : "Open"
    },
    resolution : {
        type : String,
        enum : ["Fixed", "WorksForMe", "WontFix"],
        "default" : "Fixed"
    },
    resolvedOn : {
        type : Date,
        "default" : new Date()
    },
    description : {
        type : String,
        "default" : null
    },
    labels : [{
        type : Schema.Types.ObjectId,
        ref : "Label",
        "default" : []
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
        ref : "User",
        "default" : []
    }],
    voters : [{
        type : Schema.Types.ObjectId,
        ref : "User",
        "default" : []
    }],
    comments : [{
        text : {
            type : String,
            "default" : null
        },
        commentedOn : {
            type : Date,
            "default" : (function() {
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
    return Q().then(function() {
        return Q().then(function() {
            console.log("newIssue = new Issue();\n");
            newIssue = new Issue();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newIssue['summary'] = summary;\n");
            newIssue['summary'] = summary;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newIssue['description'] = description;\n");
            newIssue['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newIssue['severity'] = severity;\n");
            newIssue['severity'] = severity;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(User['current']);\nconsole.log(\"That: \");\nconsole.log(newIssue);\nnewIssue.reporter = User['current']._id;\nconsole.log(\"This: \");\nconsole.log(newIssue);\nconsole.log(\"That: \");\nconsole.log(User['current']);\nUser['current'].issuesReportedByUser.push(newIssue._id);\n");
            console.log("This: ");
            console.log(User['current']);
            console.log("That: ");
            console.log(newIssue);
            newIssue.reporter = User['current']._id;
            console.log("This: ");
            console.log(newIssue);
            console.log("That: ");
            console.log(User['current']);
            User['current'].issuesReportedByUser.push(newIssue._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(project);\nconsole.log(\"That: \");\nconsole.log(newIssue);\nnewIssue.project = project._id;\nconsole.log(\"This: \");\nconsole.log(newIssue);\nconsole.log(\"That: \");\nconsole.log(project);\nproject.issues.push(newIssue._id);\n");
            console.log("This: ");
            console.log(project);
            console.log("That: ");
            console.log(newIssue);
            newIssue.project = project._id;
            console.log("This: ");
            console.log(newIssue);
            console.log("That: ");
            console.log(project);
            project.issues.push(newIssue._id);
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return newIssue['issueKey'];");
                return newIssue['issueKey'];
            }),
            Q().then(function() {
                console.log("return summary;");
                return summary;
            }),
            Q().then(function() {
                console.log("return description;");
                return description;
            }),
            Q().then(function() {
                console.log("return Q.npost(User, 'findOne', [ ({ _id : newIssue.reporter }) ]);");
                return Q.npost(User, 'findOne', [ ({ _id : newIssue.reporter }) ]);
            }).then(function(reporter) {
                console.log(reporter);
                console.log("return reporter['email'];");
                return reporter['email'];
            }),
            Q().then(function() {
                console.log("return newIssue['userNotifier'];");
                return newIssue['userNotifier'];
            })
        ]).spread(function(issueKey, Summary, Description, email, userNotifier) {
            userNotifier.issueReported(issueKey, Summary, Description, email);
            return Q();
        });
    }).then(function() {
        return me.save();
    });
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(null);\nconsole.log(\"That: \");\nconsole.log(me);\nme.assignee = null._id;\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(null);\nnull.issuesAssignedToUser.push(me._id);\n");
        console.log("This: ");
        console.log(null);
        console.log("That: ");
        console.log(me);
        me.assignee = null._id;
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(null);
        null.issuesAssignedToUser.push(me._id);
    }).then(function() {
        return me.save();
    });
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(newAssignee);\nconsole.log(\"That: \");\nconsole.log(me);\nme.assignee = newAssignee._id;\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(newAssignee);\nnewAssignee.issuesAssignedToUser.push(me._id);\n");
        console.log("This: ");
        console.log(newAssignee);
        console.log("That: ");
        console.log(me);
        me.assignee = newAssignee._id;
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(newAssignee);
        newAssignee.issuesAssignedToUser.push(me._id);
    }).then(function() {
        return me.save();
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
    return Q().then(function() {
        return Q().then(function() {
            console.log("me['resolvedOn'] = new Date();\n");
            me['resolvedOn'] = new Date();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("me['resolution'] = resolution;\n");
            me['resolution'] = resolution;
        });
    }).then(function() {
        return me.save();
    });
};

/**
 *  Reopen the issue. 
 */
issueSchema.methods.reopen = function (reason) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("me['resolvedOn'] = null;\n");
            me['resolvedOn'] = null;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("me['resolution'] = null;\n");
            me['resolution'] = null;
        });
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                console.log("return reason !== \"\";");
                return reason !== "";
            });
        }).then(function() {
            return Q().then(function() {
                console.log("me.comment(reason);\n");
                me.comment(reason);
            });
        });
    }).then(function() {
        return me.save();
    });
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    var me = this;
    return Q().then(function() {
        console.log("me.addComment(text, null);\n");
        me.addComment(text, null);
    }).then(function() {
        return me.save();
    });
};

issueSchema.methods.addWatcher = function (userToAdd) {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(userToAdd);\nuserToAdd.issuesWatched.push(me._id);\nconsole.log(\"This: \");\nconsole.log(userToAdd);\nconsole.log(\"That: \");\nconsole.log(me);\nme.watchers.push(userToAdd._id);\n");
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(userToAdd);
        userToAdd.issuesWatched.push(me._id);
        console.log("This: ");
        console.log(userToAdd);
        console.log("That: ");
        console.log(me);
        me.watchers.push(userToAdd._id);
    }).then(function() {
        return me.save();
    });
};

issueSchema.methods.vote = function () {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(User['current']);\nUser['current'].voted.push(me._id);\nconsole.log(\"This: \");\nconsole.log(User['current']);\nconsole.log(\"That: \");\nconsole.log(me);\nme.voters.push(User['current']._id);\n");
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(User['current']);
        User['current'].voted.push(me._id);
        console.log("This: ");
        console.log(User['current']);
        console.log("That: ");
        console.log(me);
        me.voters.push(User['current']._id);
    }).then(function() {
        return me.save();
    });
};

issueSchema.methods.withdrawVote = function () {
    var me = this;
    return Q().then(function() {
        console.log("me.voters = null;\nme = null;\n");
        me.voters = null;
        me = null;
    }).then(function() {
        return me.save();
    });
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(User['current']);\nconsole.log(\"That: \");\nconsole.log(me);\nme.assignee = User['current']._id;\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(User['current']);\nUser['current'].issuesAssignedToUser.push(me._id);\n");
        console.log("This: ");
        console.log(User['current']);
        console.log("That: ");
        console.log(me);
        me.assignee = User['current']._id;
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(User['current']);
        User['current'].issuesAssignedToUser.push(me._id);
    }).then(function() {
        return me.save();
    });
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(User['current']);\nconsole.log(\"That: \");\nconsole.log(me);\nme.assignee = User['current']._id;\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(User['current']);\nUser['current'].issuesAssignedToUser.push(me._id);\n");
        console.log("This: ");
        console.log(User['current']);
        console.log("That: ");
        console.log(me);
        me.assignee = User['current']._id;
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(User['current']);
        User['current'].issuesAssignedToUser.push(me._id);
    }).then(function() {
        return me.save();
    });
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    var me = this;
    return Q().then(function() {
        console.log(";\n");
        ;
    }).then(function() {
        return me.save();
    });
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(this.model('Issue').find().where({ severity : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(this.model('Issue').find().where({ severity : toMatch }), 'exec', [  ])
        ;
    });
};

issueSchema.statics.byStatus = function (toMatch) {
    var me = this;
    return Q().then(function() {
        console.log("return Issue.filterByStatus(this.model('Issue').find(), toMatch);");
        return Issue.filterByStatus(this.model('Issue').find(), toMatch);
    }).then(function(filterByStatus) {
        console.log(filterByStatus);
        console.log("return Q.npost(filterByStatus, 'exec', [  ])\n;\n");
        return Q.npost(filterByStatus, 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.virtual('issueKey').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Project, 'findOne', [ ({ _id : me.project }) ]);");
        return Q.npost(Project, 'findOne', [ ({ _id : me.project }) ]);
    }).then(function(project) {
        console.log(project);
        console.log("return project['token'] + \"-\" + me['issueId'];\n");
        return project['token'] + "-" + me['issueId'];
    });
});

issueSchema.virtual('votes').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(User, 'find', [ ({ voted : me._id }) ]);");
        return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
    }).then(function(readLinkAction) {
        console.log(readLinkAction);
        console.log("return /*TBD*/count;\n");
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
    return Q().then(function() {
        console.log("return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);");
        return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);
    }).then(function(assignee) {
        console.log(assignee);
        console.log("return User['current'] == assignee;\n");
        return User['current'] == assignee;
    });
});

issueSchema.virtual('free').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);");
            return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);
        }),
        Q().then(function() {
            console.log("return null;");
            return null;
        })
    ]).spread(function(assignee, valueSpecificationAction) {
        return assignee == valueSpecificationAction;
    });
});
/*************************** PRIVATE OPS ***********************/

issueSchema.methods.referenceDate = function () {
    if (this['resolvedOn'] == null) {
        return Q.npost(new Date(), 'exec', [  ])
        ;
    } else  {
        return Q.npost(this['resolvedOn'], 'exec', [  ])
        ;
    }
};

issueSchema.statics.filterByStatus = function (issues, toMatch) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(issues.where({ status : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(issues.where({ status : toMatch }), 'exec', [  ])
        ;
    });
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    var comment;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("comment = new Comment();\n");
            comment = new Comment();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(User['current']);\nconsole.log(\"That: \");\nconsole.log(comment);\ncomment.user = User['current']._id\n;\n");
            console.log("This: ");
            console.log(User['current']);
            console.log("That: ");
            console.log(comment);
            comment.user = User['current']._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("comment['commentedOn'] = new Date();\n");
            comment['commentedOn'] = new Date();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("comment['text'] = text;\n");
            comment['text'] = text;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(inReplyTo);\nconsole.log(\"That: \");\nconsole.log(comment);\ncomment.inReplyTo = inReplyTo._id\n;\n");
            console.log("This: ");
            console.log(inReplyTo);
            console.log("That: ");
            console.log(comment);
            comment.inReplyTo = inReplyTo._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(comment);\ncomment.issue = me._id;\nconsole.log(\"This: \");\nconsole.log(comment);\nconsole.log(\"That: \");\nconsole.log(me);\nme.comments.push(comment._id);\n");
            console.log("This: ");
            console.log(me);
            console.log("That: ");
            console.log(comment);
            comment.issue = me._id;
            console.log("This: ");
            console.log(comment);
            console.log("That: ");
            console.log(me);
            me.comments.push(comment._id);
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return me['issueKey'];");
                return me['issueKey'];
            }),
            Q().then(function() {
                console.log("return Q.npost(User, 'findOne', [ ({ _id : comment.user }) ]);");
                return Q.npost(User, 'findOne', [ ({ _id : comment.user }) ]);
            }).then(function(user) {
                console.log(user);
                console.log("return user['email'];");
                return user['email'];
            }),
            Q().then(function() {
                console.log("return Q.npost(User, 'findOne', [ ({ _id : me.reporter }) ]);");
                return Q.npost(User, 'findOne', [ ({ _id : me.reporter }) ]);
            }).then(function(reporter) {
                console.log(reporter);
                console.log("return reporter['email'];");
                return reporter['email'];
            }),
            Q().then(function() {
                console.log("return text;");
                return text;
            }),
            Q().then(function() {
                console.log("return me['userNotifier'];");
                return me['userNotifier'];
            })
        ]).spread(function(issueKey, email, email, Text, userNotifier) {
            userNotifier.commentAdded(issueKey, email, email, Text);
            return Q();
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
