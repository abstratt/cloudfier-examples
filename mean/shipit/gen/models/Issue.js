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
            /*sync*/return new Date();
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
                /*sync*/return new Date();
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
        /*sync*/return User.provisioned;
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
                newIssue = new Issue();
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(String, 'findOne', [ ({ _id : summary._id }) ]);
            }).then(function(summary) {
                newIssue['summary'] = summary;
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
            }).then(function(description) {
                newIssue['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(Severity, 'findOne', [ ({ _id : severity._id }) ]);
            }).then(function(severity) {
                newIssue['severity'] = severity;
            });
        }).then(function() {
            return Q().then(function() {
                newIssue.reporter = User.current._id;
                User.current.issuesReportedByUser.push(newIssue._id);
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(Project, 'findOne', [ ({ _id : project._id }) ]);
            }).then(function(project) {
                newIssue.project = project._id;
                project.issues.push(newIssue._id);
            });
        }).then(function() {
            return Q.all([
                Q().then(function() {
                    return newIssue.getIssueKey();
                }),
                Q().then(function() {
                    return Q.npost(String, 'findOne', [ ({ _id : summary._id }) ]);
                }),
                Q().then(function() {
                    return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
                }),
                Q().then(function() {
                    return Q.npost(User, 'findOne', [ ({ _id : newIssue.reporter }) ]);
                }).then(function(reporter) {
                    return reporter.email;
                }),
                Q().then(function() {
                    return newIssue.userNotifier;
                })
            ]).spread(function(issueKey, summary, description, email, userNotifier) {
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
            return me.isMine();
        }).then(function(mine) {
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
                return me.isFree();
            }),
            Q().then(function() {
                return me.isMine();
            })
        ]).spread(function(free, mine) {
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
            return Q.npost(User, 'findOne', [ ({ _id : newAssignee._id }) ]);
        }).then(function(newAssignee) {
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
                return me.isFree();
            }),
            Q().then(function() {
                return me.isMine();
            })
        ]).spread(function(free, mine) {
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
                me['resolvedOn'] = new Date();
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(Resolution, 'findOne', [ ({ _id : resolution._id }) ]);
            }).then(function(resolution) {
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
            me['resolvedOn'] = null;
        });
    }).then(function() {
        return Q().then(function() {
            me['resolution'] = null;
        });
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);
            }).then(function(reason) {
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
                    return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);
                }),
                Q().then(function() {
                    return me;
                })
            ]).spread(function(reason, readSelfAction) {
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
            return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);
        }),
        Q().then(function() {
            return null;
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(text, valueSpecificationAction, readSelfAction) {
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
        return Q.npost(User, 'findOne', [ ({ _id : userToAdd._id }) ]);
    }).then(function(userToAdd) {
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
        /*sync*/return !(User.current == null);
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::vote')");
            error.context = 'shipit::Issue::vote';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return me.isMine();
        }).then(function(mine) {
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
            return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
        }).then(function(readLinkAction) {
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
        /*sync*/return !(User.current == null);
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::withdrawVote')");
            error.context = 'shipit::Issue::withdrawVote';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
        }).then(function(readLinkAction) {
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
        /*sync*/return User.current.isCommitter();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::assignToMe')");
            error.context = 'shipit::Issue::assignToMe';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return me.isMine();
        }).then(function(mine) {
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
        /*sync*/return User.current.isCommitter();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::Issue::steal')");
            error.context = 'shipit::Issue::steal';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return me.isMine();
        }).then(function(mine) {
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
        return Q.npost(mongoose.model('Issue').find().where({ /*read-structural-feature*/severity : toMatch }), 'exec', [  ])
        ;
    });
};

issueSchema.statics.byStatus = function (toMatch) {
    var me = this;
    return Q().then(function() {
        return Q.npost(Status, 'findOne', [ ({ _id : toMatch._id }) ]);
    }).then(function(toMatch) {
        return Issue.filterByStatus(mongoose.model('Issue').find(), toMatch);
    }).then(function(filterByStatus) {
        return Q.npost(filterByStatus, 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.methods.getIssueKey = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(Project, 'findOne', [ ({ _id : me.project }) ]);
    }).then(function(project) {
        return project.token + "-" + me.getIssueId();
    });
};

issueSchema.methods.getVotes = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(User, 'find', [ ({ voted : me._id }) ]);
    }).then(function(readLinkAction) {
        return readLinkAction.length;
    });
};

issueSchema.methods.getCommentCount = function () {
    /*sync*/return  this.comments.length;
};

issueSchema.methods.getWaitingFor = function () {
    /*sync*/return "" + ( this.referenceDate() -  this.reportedOn) / (1000*60*60*24) + " day(s)";
};

issueSchema.methods.isMine = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);
    }).then(function(assignee) {
        return User.current == assignee;
    });
};

issueSchema.methods.isFree = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(User, 'findOne', [ ({ _id : me.assignee }) ]);
        }),
        Q().then(function() {
            return null;
        })
    ]).spread(function(assignee, valueSpecificationAction) {
        return assignee == valueSpecificationAction;
    });
};
/*************************** PRIVATE OPS ***********************/

issueSchema.methods.referenceDate = function () {
    /*sync*/if ( this.resolvedOn == null) {
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
        return Q.npost(Issue, 'findOne', [ ({ _id : issues._id }) ]);
    }).then(function(issues) {
        return Q.npost(issues.where({ /*read-structural-feature*/status : toMatch }), 'exec', [  ])
        ;
    });
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    var comment;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            comment = new Comment();
        });
    }).then(function() {
        return Q().then(function() {
            comment.user = User.current._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            comment['commentedOn'] = new Date();
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);
        }).then(function(text) {
            comment['text'] = text;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Comment, 'findOne', [ ({ _id : inReplyTo._id }) ]);
        }).then(function(inReplyTo) {
            comment.inReplyTo = inReplyTo._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            comment.issue = me._id;
            me.comments.push(comment._id);
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return me.getIssueKey();
            }),
            Q().then(function() {
                return Q.npost(User, 'findOne', [ ({ _id : comment.user }) ]);
            }).then(function(user) {
                return user.email;
            }),
            Q().then(function() {
                return Q.npost(User, 'findOne', [ ({ _id : me.reporter }) ]);
            }).then(function(reporter) {
                return reporter.email;
            }),
            Q().then(function() {
                return Q.npost(Memo, 'findOne', [ ({ _id : text._id }) ]);
            }),
            Q().then(function() {
                return me.userNotifier;
            })
        ]).spread(function(issueKey, email, email, text, userNotifier) {
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
