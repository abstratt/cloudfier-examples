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
            // isAsynchronous: false        
            console.log("return new Date()");
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
                // isAsynchronous: false        
                console.log("return new Date()");
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
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return User.provisioned");
        return User.provisioned;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return User.provisioned');\n    return User.provisioned;\n}");
        throw "Precondition on reportIssue was violated"
    }
    var newIssue;
    console.log("newIssue = new Issue()");
    newIssue = new Issue();
    
    console.log("newIssue.summary = summary");
    newIssue.summary = summary;
    
    console.log("newIssue.description = description");
    newIssue.description = description;
    
    console.log("newIssue.severity = severity");
    newIssue.severity = severity;
    
    console.log("newIssue.reporter = User.current");
    newIssue.reporter = User.current;
    
    console.log("newIssue.project = project");
    newIssue.project = project;
    
    console.log("/*newIssue.userNotifier.issueReported(newIssue.issueKey, summary, description, newIssue.reporter.email)*/");
    /*newIssue.userNotifier.issueReported(newIssue.issueKey, summary, description, newIssue.reporter.email)*/;
};

/**
 *  Release the issue so another committer can work on it. 
 */
issueSchema.methods.release = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.mine");
        return this.mine;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.mine');\n    return this.mine;\n}");
        throw "Precondition on release was violated"
    }
    console.log("this.assignee = null");
    this.assignee = null;
    this.handleEvent('release');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Assign an issue to a user. 
 */
issueSchema.methods.assign = function (newAssignee) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.mine || this.free");
        return this.mine || this.free;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.mine || this.free');\n    return this.mine || this.free;\n}");
        throw "Precondition on assign was violated"
    }
    console.log("this.assignee = newAssignee");
    this.assignee = newAssignee;
    this.handleEvent('assign');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Suspend work on this issue. 
 */
issueSchema.methods.suspend = function () {
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.mine");
        return this.mine;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.mine');\n    return this.mine;\n}");
        throw "Precondition on suspend was violated"
    }
    this.handleEvent('suspend');    
};

/**
 *  Start/resume work on this issue. 
 */
issueSchema.methods.start = function () {
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.mine");
        return this.mine;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.mine');\n    return this.mine;\n}");
        throw "Precondition on start was violated"
    }
    this.handleEvent('start');    
};

/**
 *  Resolve the issue. 
 */
issueSchema.methods.resolve = function (resolution) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.mine || this.free");
        return this.mine || this.free;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.mine || this.free');\n    return this.mine || this.free;\n}");
        throw "Precondition on resolve was violated"
    }
    console.log("this.resolvedOn = new Date()");
    this.resolvedOn = new Date();
    
    console.log("this.resolution = resolution");
    this.resolution = resolution;
    this.handleEvent('resolve');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Reopen the issue. 
 */
issueSchema.methods.reopen = function (reason) {
    // isAsynchronous: true        
    console.log("this.resolvedOn = null");
    this.resolvedOn = null;
    
    console.log("this.resolution = null");
    this.resolution = null;
    
    if (reason !== "") {
        console.log("this.comment(reason)");
        this.comment(reason);
    }
    this.handleEvent('reopen');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Add a comment to the issue 
 */
issueSchema.methods.comment = function (text) {
    // isAsynchronous: true        
    console.log("this.addComment(text, null)");
    this.addComment(text, null);
    this.handleEvent('comment');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

issueSchema.methods.addWatcher = function (userToAdd) {
    // isAsynchronous: true        
    console.log("// link issuesWatched and watchersnuserToAdd.issuesWatched.push(this);nthis.watchers.push(userToAdd)");
    // link issuesWatched and watchers
    userToAdd.issuesWatched.push(this);
    this.watchers.push(userToAdd);
    this.handleEvent('addWatcher');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

issueSchema.methods.vote = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !User.current == null");
        return !User.current == null;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !User.current == null');\n    return !User.current == null;\n}");
        throw "Precondition on vote was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.mine");
        return !this.mine;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.mine');\n    return !this.mine;\n}");
        throw "Precondition on vote was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !includes");
        return !includes;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !includes');\n    return !includes;\n}");
        throw "Precondition on vote was violated"
    }
    console.log("// link voted and votersnUser.current.voted.push(this);nthis.voters.push(User.current)");
    // link voted and voters
    User.current.voted.push(this);
    this.voters.push(User.current);
    this.handleEvent('vote');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

issueSchema.methods.withdrawVote = function () {
    // isAsynchronous: false        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !User.current == null");
        return !User.current == null;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !User.current == null');\n    return !User.current == null;\n}");
        throw "Precondition on withdrawVote was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return includes");
        return includes;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return includes');\n    return includes;\n}");
        throw "Precondition on withdrawVote was violated"
    }
    console.log("this.voters = null;nthis = null");
    this.voters = null;
    this = null;
    this.handleEvent('withdrawVote');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Take over an issue currently available. 
 */
issueSchema.methods.assignToMe = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return User.current.committer");
        return User.current.committer;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return User.current.committer');\n    return User.current.committer;\n}");
        throw "Precondition on assignToMe was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.mine");
        return !this.mine;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.mine');\n    return !this.mine;\n}");
        throw "Precondition on assignToMe was violated"
    }
    console.log("this.assignee = User.current");
    this.assignee = User.current;
    this.handleEvent('assignToMe');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Take over an issue currently assigned to another user (not in progress). 
 */
issueSchema.methods.steal = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return User.current.committer");
        return User.current.committer;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return User.current.committer');\n    return User.current.committer;\n}");
        throw "Precondition on steal was violated"
    }
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.mine");
        return !this.mine;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.mine');\n    return !this.mine;\n}");
        throw "Precondition on steal was violated"
    }
    console.log("this.assignee = User.current");
    this.assignee = User.current;
    this.handleEvent('steal');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Close the issue marking it as verified. 
 */
issueSchema.methods.verify = function () {
    // isAsynchronous: false        
    this.handleEvent('verify');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** QUERIES ***************************/

issueSchema.statics.bySeverity = function (toMatch) {
    // isAsynchronous: true        
    console.log("return this.model('Issue').find().where({ severity : toMatch }).exec()");
    return this.model('Issue').find().where({ severity : toMatch }).exec();
};

issueSchema.statics.byStatus = function (toMatch) {
    // isAsynchronous: true        
    console.log("return Issue.filterByStatus(this.model('Issue').find(), toMatch).exec()");
    return Issue.filterByStatus(this.model('Issue').find(), toMatch).exec();
};
/*************************** DERIVED PROPERTIES ****************/


issueSchema.virtual('issueKey').get(function () {
    // isAsynchronous: false        
    console.log("return this.project.token + '-' + this.issueId");
    return this.project.token + "-" + this.issueId;
});

issueSchema.virtual('votes').get(function () {
    // isAsynchronous: false        
    console.log("return count");
    return count;
});

issueSchema.virtual('commentCount').get(function () {
    // isAsynchronous: false        
    console.log("return count");
    return count;
});

issueSchema.virtual('waitingFor').get(function () {
    // isAsynchronous: false        
    console.log("return '' + (this.referenceDate() - this.reportedOn) / (1000*60*60*24) + ' day(s)'");
    return "" + (this.referenceDate() - this.reportedOn) / (1000*60*60*24) + " day(s)";
});

issueSchema.virtual('mine').get(function () {
    // isAsynchronous: false        
    console.log("return User.current == this.assignee");
    return User.current == this.assignee;
});

issueSchema.virtual('free').get(function () {
    // isAsynchronous: false        
    console.log("return this.assignee == null");
    return this.assignee == null;
});
/*************************** PRIVATE OPS ***********************/

issueSchema.methods.referenceDate = function () {
    // isAsynchronous: false        
    if (this.resolvedOn == null) {
        console.log("return new Date().exec()");
        return new Date().exec();
    } else  {
        console.log("return this.resolvedOn.exec()");
        return this.resolvedOn.exec();
    }
};

issueSchema.statics.filterByStatus = function (issues, toMatch) {
    // isAsynchronous: false        
    console.log("return issues.where({ status : toMatch }).exec()");
    return issues.where({ status : toMatch }).exec();
};

issueSchema.methods.addComment = function (text, inReplyTo) {
    // isAsynchronous: true        
    var comment;
    console.log("comment = new Comment()");
    comment = new Comment();
    
    console.log("comment.user = User.current");
    comment.user = User.current;
    
    console.log("comment.commentedOn = new Date()");
    comment.commentedOn = new Date();
    
    console.log("comment.text = text");
    comment.text = text;
    
    console.log("comment.inReplyTo = inReplyTo");
    comment.inReplyTo = inReplyTo;
    
    console.log("// link issue and commentsncomment.issue = this;nthis.comments.push(comment)");
    // link issue and comments
    comment.issue = this;
    this.comments.push(comment);
    
    console.log("/*this.userNotifier.commentAdded(this.issueKey, comment.user.email, this.reporter.email, text)*/");
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
