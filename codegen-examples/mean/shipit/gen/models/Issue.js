var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : null
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
//            issueSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

/**
 *  Report a new issue. 
 */
issueSchema.statics.reportIssue = function (project, summary, description, severity) {
    var newIssue;
    return /* Working set: [newIssue] */Q().then(function() {
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
            console.log("newIssue.reporter = User.current._id;\nUser.current.issuesReportedByUser.push(newIssue._id);\n");
            newIssue.reporter = User.current._id;
            User.current.issuesReportedByUser.push(newIssue._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newIssue.project = project._id;\nproject.issues.push(newIssue._id);\n");
            newIssue.project = project._id;
            project.issues.push(newIssue._id);
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return newIssue.issueKey;");
                return newIssue.issueKey;
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
                console.log("return reporter.email;");
                return reporter.email;
            }),
            Q().then(function() {
                console.log("return newIssue.userNotifier;");
                return newIssue.userNotifier;
            })
        ]).spread(function(issueKey, Summary, Description, email, userNotifier) {
            userNotifier.issueReported(issueKey, Summary, Description, email);
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(newIssue, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    });
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.assignee = null._id;\nnull.issuesAssignedToUser.push(me._id);\n");
        me.assignee = null._id;
        null.issuesAssignedToUser.push(me._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.assignee = newAssignee._id;\nnewAssignee.issuesAssignedToUser.push(me._id);\n");
        me.assignee = newAssignee._id;
        newAssignee.issuesAssignedToUser.push(me._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
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
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        return Q().then(function() {
            console.log("me['resolvedOn'] = new Date();\n");
            me['resolvedOn'] = new Date();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("me['resolution'] = resolution;\n");
            me['resolution'] = resolution;
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Reopen the issue. 
 */
issueSchema.methods.reopen = function (reason) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
        return /* Working set: [me] */Q().then(function() {
            return /* Working set: [me] */Q().then(function() {
                console.log("return reason !== \"\";");
                return reason !== "";
            }).then(function(/*no-arg*/) {
                return Q.all([
                    Q().then(function() {
                        return Q.npost(me, 'save', [  ]);
                    })
                ]).spread(function() {
                    /* no-result */    
                });
            })
            ;
        }).then(function() {
            return /* Working set: [me] */Q().then(function() {
                console.log("return me.comment(reason);");
                return me.comment(reason);
            }).then(function(/*no-arg*/) {
                return Q.all([
                    Q().then(function() {
                        return Q.npost(me, 'save', [  ]);
                    })
                ]).spread(function() {
                    /* no-result */    
                });
            })
            ;
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("return me.addComment(text, null);");
        return me.addComment(text, null);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

issueSchema.methods.addWatcher = function (userToAdd) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("userToAdd.issuesWatched.push(me._id);\nme.watchers.push(userToAdd._id);\n");
        userToAdd.issuesWatched.push(me._id);
        me.watchers.push(userToAdd._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

issueSchema.methods.vote = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("User.current.voted.push(me._id);\nme.voters.push(User.current._id);\n");
        User.current.voted.push(me._id);
        me.voters.push(User.current._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

issueSchema.methods.withdrawVote = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.voters = null;\nme = null;\n");
        me.voters = null;
        me = null;
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.assignee = User.current._id;\nUser.current.issuesAssignedToUser.push(me._id);\n");
        me.assignee = User.current._id;
        User.current.issuesAssignedToUser.push(me._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.assignee = User.current._id;\nUser.current.issuesAssignedToUser.push(me._id);\n");
        me.assignee = User.current._id;
        User.current.issuesAssignedToUser.push(me._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log(";\n");
        ;
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Issue').find().where({ severity : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Issue').find().where({ severity : toMatch }), 'exec', [  ])
        ;
    });
};

issueSchema.statics.byStatus = function (toMatch) {
    return Q().then(function() {
        console.log("return Issue.filterByStatus(mongoose.model('Issue').find(), toMatch);");
        return Issue.filterByStatus(mongoose.model('Issue').find(), toMatch);
    }).then(function(filterByStatus) {
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
        console.log("return project.token + \"-\" + me.issueId;\n");
        return project.token + "-" + me.issueId;
    });
});

issueSchema.virtual('votes').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(User, 'find', [ ({ voted : me._id }) ]);");
        return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
    }).then(function(readLinkAction) {
        console.log("return readLinkAction.length;\n");
        return readLinkAction.length;
    });
});

issueSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

issueSchema.virtual('waitingFor').get(function () {
    return "" + (this.referenceDate() - this.reportedOn) / (1000*60*60*24) + " day(s)";
});

issueSchema.virtual('mine').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);");
        return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);
    }).then(function(assignee) {
        console.log("return User.current == assignee;\n");
        return User.current == assignee;
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
    if (this.resolvedOn == null) {
        return Q.npost(new Date(), 'exec', [  ])
        ;
    } else  {
        return Q.npost(this.resolvedOn, 'exec', [  ])
        ;
    }
};

issueSchema.statics.filterByStatus = function (issues, toMatch) {
    return Q().then(function() {
        console.log("return Q.npost(issues.where({ status : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(issues.where({ status : toMatch }), 'exec', [  ])
        ;
    });
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    var comment;
    var me = this;
    return /* Working set: [me] *//* Working set: [me, comment] */Q().then(function() {
        return Q().then(function() {
            console.log("comment = new Comment();\n");
            comment = new Comment();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("comment.user = User.current._id\n;\n");
            comment.user = User.current._id
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
            console.log("comment.inReplyTo = inReplyTo._id\n;\n");
            comment.inReplyTo = inReplyTo._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("comment.issue = me._id;\nme.comments.push(comment._id);\n");
            comment.issue = me._id;
            me.comments.push(comment._id);
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return me.issueKey;");
                return me.issueKey;
            }),
            Q().then(function() {
                console.log("return Q.npost(User, 'findOne', [ ({ _id : comment.user }) ]);");
                return Q.npost(User, 'findOne', [ ({ _id : comment.user }) ]);
            }).then(function(user) {
                console.log("return user.email;");
                return user.email;
            }),
            Q().then(function() {
                console.log("return Q.npost(User, 'findOne', [ ({ _id : me.reporter }) ]);");
                return Q.npost(User, 'findOne', [ ({ _id : me.reporter }) ]);
            }).then(function(reporter) {
                console.log("return reporter.email;");
                return reporter.email;
            }),
            Q().then(function() {
                console.log("return text;");
                return text;
            }),
            Q().then(function() {
                console.log("return me.userNotifier;");
                return me.userNotifier;
            })
        ]).spread(function(issueKey, email, email, Text, userNotifier) {
            userNotifier.commentAdded(issueKey, email, email, Text);
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(comment, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};
/*************************** STATE MACHINE ********************/
issueSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+")");
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
