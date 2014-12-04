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
            /*sync*/console.log("return new Date();");
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
                /*sync*/console.log("return new Date();");
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
    var me = this;
    return Q().then(function() {
        /*sync*/console.log("return User.provisioned;");
        return User.provisioned;
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Must_be_logged_in (on 'shipit::Issue::reportIssue')");
            error.context = 'shipit::Issue::reportIssue';
            error.constraint = 'Must_be_logged_in';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                console.log("newIssue = new Issue();\n");
                newIssue = new Issue();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(String, 'findOne', [ ({ _id : summary._id }) ]);");
                return Q.npost(String, 'findOne', [ ({ _id : summary._id }) ]);
            }).then(function(summary) {
                console.log("newIssue['summary'] = summary;\n");
                newIssue['summary'] = summary;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);");
                return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
            }).then(function(description) {
                console.log("newIssue['description'] = description;\n");
                newIssue['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Severity, 'findOne', [ ({ _id : severity._id }) ]);");
                return Q.npost(Severity, 'findOne', [ ({ _id : severity._id }) ]);
            }).then(function(severity) {
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
                console.log("return Q.npost(Project, 'findOne', [ ({ _id : project._id }) ]);");
                return Q.npost(Project, 'findOne', [ ({ _id : project._id }) ]);
            }).then(function(project) {
                console.log("newIssue.project = project._id;\nproject.issues.push(newIssue._id);\n");
                newIssue.project = project._id;
                project.issues.push(newIssue._id);
            });
        }).then(function() {
            return Q.all([
                Q().then(function() {
                    console.log("return newIssue.getIssueKey();");
                    return newIssue.getIssueKey();
                }),
                Q().then(function() {
                    console.log("return Q.npost(String, 'findOne', [ ({ _id : summary._id }) ]);");
                    return Q.npost(String, 'findOne', [ ({ _id : summary._id }) ]);
                }),
                Q().then(function() {
                    console.log("return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);");
                    return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
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
            ]).spread(function(issueKey, summary, description, email, userNotifier) {
                console.log("issueKey:" + issueKey);console.log("summary:" + summary);console.log("description:" + description);console.log("email:" + email);console.log("userNotifier:" + userNotifier);
                return userNotifier.issueReported(issueKey, summary, description, email);;
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
    });
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return me.isMine();");
            return me.isMine();
        }).then(function(mine) {
            console.log("return mine;\n");
            return mine;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::release')");
            error.context = 'shipit::Issue::release';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
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
    });
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    var me = this;
    return Q().then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return me.isFree();");
                return me.isFree();
            }),
            Q().then(function() {
                console.log("return me.isMine();");
                return me.isMine();
            })
        ]).spread(function(free, mine) {
            console.log("free:" + free);console.log("mine:" + mine);
            return mine || free;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::assign')");
            error.context = 'shipit::Issue::assign';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(User, 'findOne', [ ({ _id : newAssignee._id }) ]);");
            return Q.npost(User, 'findOne', [ ({ _id : newAssignee._id }) ]);
        }).then(function(newAssignee) {
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
        return Q.all([
            Q().then(function() {
                console.log("return me.isFree();");
                return me.isFree();
            }),
            Q().then(function() {
                console.log("return me.isMine();");
                return me.isMine();
            })
        ]).spread(function(free, mine) {
            console.log("free:" + free);console.log("mine:" + mine);
            return mine || free;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::resolve')");
            error.context = 'shipit::Issue::resolve';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                console.log("me['resolvedOn'] = new Date();\n");
                me['resolvedOn'] = new Date();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Resolution, 'findOne', [ ({ _id : resolution._id }) ]);");
                return Q.npost(Resolution, 'findOne', [ ({ _id : resolution._id }) ]);
            }).then(function(resolution) {
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
                console.log("return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);");
                return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);
            }).then(function(reason) {
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
            return Q.all([
                Q().then(function() {
                    console.log("return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);");
                    return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);
                }),
                Q().then(function() {
                    console.log("return me;");
                    return me;
                })
            ]).spread(function(reason, readSelfAction) {
                console.log("reason:" + reason);console.log("readSelfAction:" + readSelfAction);
                return readSelfAction.comment(reason);
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
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);");
            return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);
        }),
        Q().then(function() {
            console.log("return null;");
            return null;
        }),
        Q().then(function() {
            console.log("return me;");
            return me;
        })
    ]).spread(function(text, valueSpecificationAction, readSelfAction) {
        console.log("text:" + text);console.log("valueSpecificationAction:" + valueSpecificationAction);console.log("readSelfAction:" + readSelfAction);
        return readSelfAction.addComment(text, valueSpecificationAction);
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
    return Q().then(function() {
        console.log("return Q.npost(User, 'findOne', [ ({ _id : userToAdd._id }) ]);");
        return Q.npost(User, 'findOne', [ ({ _id : userToAdd._id }) ]);
    }).then(function(userToAdd) {
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
    return Q().then(function() {
        /*sync*/console.log("return !(User.current == null);");
        return !(User.current == null);
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::vote')");
            error.context = 'shipit::Issue::vote';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return me.isMine();");
            return me.isMine();
        }).then(function(mine) {
            console.log("return !(mine);\n");
            return !(mine);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::vote')");
            error.context = 'shipit::Issue::vote';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(User, 'find', [ ({ voted : me._id }) ]);");
            return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
        }).then(function(readLinkAction) {
            console.log("return !(/*TBD*/includes);\n");
            return !(/*TBD*/includes);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::vote')");
            error.context = 'shipit::Issue::vote';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
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
    });
};

issueSchema.methods.withdrawVote = function () {
    var me = this;
    return Q().then(function() {
        /*sync*/console.log("return !(User.current == null);");
        return !(User.current == null);
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::withdrawVote')");
            error.context = 'shipit::Issue::withdrawVote';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(User, 'find', [ ({ voted : me._id }) ]);");
            return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
        }).then(function(readLinkAction) {
            console.log("return /*TBD*/includes;\n");
            return /*TBD*/includes;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::withdrawVote')");
            error.context = 'shipit::Issue::withdrawVote';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
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
    });
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    var me = this;
    return Q().then(function() {
        /*sync*/console.log("return User.current.isCommitter();");
        return User.current.isCommitter();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::assignToMe')");
            error.context = 'shipit::Issue::assignToMe';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return me.isMine();");
            return me.isMine();
        }).then(function(mine) {
            console.log("return !(mine);\n");
            return !(mine);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::assignToMe')");
            error.context = 'shipit::Issue::assignToMe';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
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
    });
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    var me = this;
    return Q().then(function() {
        /*sync*/console.log("return User.current.isCommitter();");
        return User.current.isCommitter();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::steal')");
            error.context = 'shipit::Issue::steal';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("return me.isMine();");
            return me.isMine();
        }).then(function(mine) {
            console.log("return !(mine);\n");
            return !(mine);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::steal')");
            error.context = 'shipit::Issue::steal';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
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
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Issue').find().where({ severity : toMatch }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Issue').find().where({ severity : toMatch }), 'exec', [  ])
        ;
    });
};

issueSchema.statics.byStatus = function (toMatch) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Status, 'findOne', [ ({ _id : toMatch._id }) ]);");
        return Q.npost(Status, 'findOne', [ ({ _id : toMatch._id }) ]);
    }).then(function(toMatch) {
        console.log("return Issue.filterByStatus(mongoose.model('Issue').find(), toMatch);");
        return Issue.filterByStatus(mongoose.model('Issue').find(), toMatch);
    }).then(function(filterByStatus) {
        console.log("return Q.npost(filterByStatus, 'exec', [  ])\n;\n");
        return Q.npost(filterByStatus, 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.methods.getIssueKey = function () {
    console.log("this.issueKey: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Project, 'findOne', [ ({ _id : me.project }) ]);");
        return Q.npost(Project, 'findOne', [ ({ _id : me.project }) ]);
    }).then(function(project) {
        console.log("return project.token + \"-\" + me.getIssueId();\n");
        return project.token + "-" + me.getIssueId();
    });
};

issueSchema.methods.getVotes = function () {
    console.log("this.votes: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(User, 'find', [ ({ voted : me._id }) ]);");
        return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
    }).then(function(readLinkAction) {
        console.log("return readLinkAction.length;\n");
        return readLinkAction.length;
    });
};

issueSchema.methods.getCommentCount = function () {
    console.log("this.commentCount: " + JSON.stringify(this));
    /*sync*/console.log("return  this.comments.length;");
    return  this.comments.length;
};

issueSchema.methods.getWaitingFor = function () {
    console.log("this.waitingFor: " + JSON.stringify(this));
    /*sync*/console.log("return \"\" + ( this.referenceDate() -  this.reportedOn) / (1000*60*60*24) + \" day(s)\";");
    return "" + ( this.referenceDate() -  this.reportedOn) / (1000*60*60*24) + " day(s)";
};

issueSchema.methods.isMine = function () {
    console.log("this.mine: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);");
        return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);
    }).then(function(assignee) {
        console.log("return User.current == assignee;\n");
        return User.current == assignee;
    });
};

issueSchema.methods.isFree = function () {
    console.log("this.free: " + JSON.stringify(this));
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
        console.log("assignee:" + assignee);console.log("valueSpecificationAction:" + valueSpecificationAction);
        return assignee == valueSpecificationAction;
    });
};
/*************************** PRIVATE OPS ***********************/

issueSchema.methods.referenceDate = function () {
    /*sync*/console.log("if ( this.resolvedOn == null) {\n    return Q.npost(new Date(), 'exec', [  ])\n    ;\n} else  {\n    return Q.npost( this.resolvedOn, 'exec', [  ])\n    ;\n}");
    if ( this.resolvedOn == null) {
        return Q.npost(new Date(), 'exec', [  ])
        ;
    } else  {
        return Q.npost( this.resolvedOn, 'exec', [  ])
        ;
    }
};

issueSchema.statics.filterByStatus = function (issues, toMatch) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Issue, 'findOne', [ ({ _id : issues._id }) ]);");
        return Q.npost(Issue, 'findOne', [ ({ _id : issues._id }) ]);
    }).then(function(issues) {
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
            console.log("return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);");
            return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);
        }).then(function(text) {
            console.log("comment['text'] = text;\n");
            comment['text'] = text;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Comment, 'findOne', [ ({ _id : inReplyTo._id }) ]);");
            return Q.npost(Comment, 'findOne', [ ({ _id : inReplyTo._id }) ]);
        }).then(function(inReplyTo) {
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
                console.log("return me.getIssueKey();");
                return me.getIssueKey();
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
                console.log("return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);");
                return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);
            }),
            Q().then(function() {
                console.log("return me.userNotifier;");
                return me.userNotifier;
            })
        ]).spread(function(issueKey, email, email, text, userNotifier) {
            console.log("issueKey:" + issueKey);console.log("email:" + email);console.log("email:" + email);console.log("text:" + text);console.log("userNotifier:" + userNotifier);
            return userNotifier.commentAdded(issueKey, email, email, text);;
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
                break;
            }
            if (this.status == 'Assigned') {
                this.status = 'Resolved';
                break;
            }
            break;
        
        case 'assignToMe' :
            if (this.status == 'Open') {
                this.status = 'Assigned';
                break;
            }
            break;
        
        case 'assign' :
            if (this.status == 'Open') {
                this.status = 'Assigned';
                break;
            }
            break;
        
        case 'suspend' :
            if (this.status == 'InProgress') {
                this.status = 'Assigned';
                break;
            }
            break;
        
        case 'release' :
            if (this.status == 'Assigned') {
                this.status = 'Open';
                break;
            }
            break;
        
        case 'steal' :
            if (this.status == 'Assigned') {
                this.status = 'Assigned';
                break;
            }
            break;
        
        case 'start' :
            if (this.status == 'Assigned') {
                this.status = 'InProgress';
                break;
            }
            break;
        
        case 'verify' :
            if (this.status == 'Resolved') {
                this.status = 'Verified';
                break;
            }
            break;
        
        case 'reopen' :
            if (this.status == 'Verified') {
                this.status = 'Open';
                break;
            }
            break;
    }
    console.log("completed handleEvent("+ event+")");
    return Q.npost( this, 'save', [  ]);
};

issueSchema.methods.resolve = function () {
    return this.handleEvent('resolve');
};
issueSchema.methods.assignToMe = function () {
    return this.handleEvent('assignToMe');
};
issueSchema.methods.assign = function () {
    return this.handleEvent('assign');
};
issueSchema.methods.suspend = function () {
    return this.handleEvent('suspend');
};
issueSchema.methods.release = function () {
    return this.handleEvent('release');
};
issueSchema.methods.steal = function () {
    return this.handleEvent('steal');
};
issueSchema.methods.start = function () {
    return this.handleEvent('start');
};
issueSchema.methods.verify = function () {
    return this.handleEvent('verify');
};
issueSchema.methods.reopen = function () {
    return this.handleEvent('reopen');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Issue', issueSchema);
