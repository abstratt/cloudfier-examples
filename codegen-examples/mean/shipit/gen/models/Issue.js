    var EventEmitter = require('events').EventEmitter;        

    /**
     * An issue describes a problem report, a feature request or just a work item for a project. Issues are reported by and
     * assigned to users, and go through a lifecycle from the time they are opened until they are resolved and eventually
     * closed. 
     */
    var issueSchema = new Schema({
        summary : String,
        issueId : Number,
        issueKey : String,
        reportedOn : Date,
        severity : Severity,
        status : Status,
        resolution : Resolution,
        resolvedOn : Date,
        votes : Number,
        commentCount : Number,
        waitingFor : String,
        mine : Boolean,
        free : Boolean,
        description : String
    });
    
    /*************************** ACTIONS ***************************/
    
    /**
     *  Report a new issue. 
     */
    issueSchema.statics.reportIssue = function (project, summary, description, severity) {
        newIssue = new Issue();
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
    };
    
    /**
     *  Assign an issue to a user. 
     */
    issueSchema.methods.assign = function (newAssignee) {
        this.assignee = newAssignee;
    };
    
    /**
     *  Suspend work on this issue. 
     */
    issueSchema.methods.suspend = function () {};
    
    /**
     *  Start/resume work on this issue. 
     */
    issueSchema.methods.start = function () {};
    
    /**
     *  Resolve the issue. 
     */
    issueSchema.methods.resolve = function (resolution) {
        this.resolvedOn = new Date();
        this.resolution = resolution;
    };
    
    /**
     *  Reopen the issue. 
     */
    issueSchema.methods.reopen = function (reason) {
        this.resolvedOn = null;
        this.resolution = null;
        if (reason.notEquals("")) {
            this.comment(reason);
        }
    };
    
    /**
     *  Add a comment to the issue 
     */
    issueSchema.methods.comment = function (text) {
        this.addComment(text, null);
    };
    
    issueSchema.methods.addWatcher = function (userToAdd) {
        this.issuesWatched = userToAdd;
    };
    
    issueSchema.methods.vote = function () {
        this.voted = User.current;
    };
    
    issueSchema.methods.withdrawVote = function () {
        delete this.voted;
    };
    
    /**
     *  Take over an issue currently available. 
     */
    issueSchema.methods.assignToMe = function () {
        this.assignee = User.current;
    };
    
    /**
     *  Take over an issue currently assigned to another user (not in progress). 
     */
    issueSchema.methods.steal = function () {
        this.assignee = User.current;
    };
    
    /**
     *  Close the issue marking it as verified. 
     */
    issueSchema.methods.verify = function () {
    };
    /*************************** QUERIES ***************************/
    
    issueSchema.statics.bySeverity = function (toMatch) {
        return this.model('Issue').find().where('severity').eq(toMatch).exec();
    };
    
    issueSchema.statics.byStatus = function (toMatch) {
        return Issue.filterByStatus(this.model('Issue').find(), toMatch).exec();
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    
    issueSchema.methods.getIssueKey = function () {
        return this.project.token + "-" + this.issueId;
    };
    
    issueSchema.methods.getVotes = function () {
        return <UNSUPPORTED: CallOperationAction> ;
    };
    
    issueSchema.methods.getCommentCount = function () {
        return <UNSUPPORTED: CallOperationAction> ;
    };
    
    issueSchema.methods.getWaitingFor = function () {
        return "" +  + " day(s)";
    };
    
    issueSchema.methods.getMine = function () {
        return User.current == this.assignee;
    };
    
    issueSchema.methods.getFree = function () {
        return this.assignee == null;
    };
    /*************************** PRIVATE OPS ***********************/
    
    issueSchema.methods.referenceDate = function () {
        if (this.resolvedOn == null) {
            return new Date();
        } else  {
            return this.resolvedOn;
        }
    };
    
    issueSchema.statics.filterByStatus = function (issues, toMatch) {
        return issues.where('status').eq(toMatch);
    };
    
    issueSchema.methods.addComment = function (text, inReplyTo) {
        comment = new Comment();
        comment.user = User.current;
        comment.on = new Date();
        comment.commented = text;
        comment.inReplyTo = inReplyTo;
        this.issue = comment;
        this.userNotifier.commentAdded(this.issueKey, comment.user.email, this.reporter.email, text);
    };
    /*************************** STATE MACHINE ********************/
    Issue.emitter.on('resolve', function () {
        if (this.status == 'Open') {
            this.status = 'Resolved';
            return;
        }
        if (this.status == 'Assigned') {
            this.status = 'Resolved';
            return;
        }
    });     
    
    Issue.emitter.on('assignToMe', function () {
        if (this.status == 'Open') {
            this.status = 'Assigned';
            return;
        }
    });     
    
    Issue.emitter.on('assign', function () {
        if (this.status == 'Open') {
            this.status = 'Assigned';
            return;
        }
    });     
    
    Issue.emitter.on('suspend', function () {
        if (this.status == 'InProgress') {
            this.status = 'Assigned';
            return;
        }
    });     
    
    Issue.emitter.on('release', function () {
        if (this.status == 'Assigned') {
            this.status = 'Open';
            return;
        }
    });     
    
    Issue.emitter.on('steal', function () {
        if (this.status == 'Assigned') {
            this.status = 'Assigned';
            return;
        }
    });     
    
    Issue.emitter.on('start', function () {
        if (this.status == 'Assigned') {
            this.status = 'InProgress';
            return;
        }
    });     
    
    Issue.emitter.on('verify', function () {
        if (this.status == 'Resolved') {
            this.status = 'Verified';
            return;
        }
    });     
    
    Issue.emitter.on('reopen', function () {
        if (this.status == 'Verified') {
            this.status = 'Open';
            return;
        }
    });     
    
    var Issue = mongoose.model('Issue', issueSchema);
    Issue.emitter = new EventEmitter();
