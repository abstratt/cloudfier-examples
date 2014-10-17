    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var userSchema = new Schema({
        email : {
            type : String
        },
        fullName : {
            type : String,
            required : true
        },
        kind : {
            type : String,
            enum : ["Reporter", "Committer"]
        },
        committer : {
            type : Boolean
        },
        issuesReportedByUser : [{
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }],
        issuesCurrentlyInProgress : [{
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }],
        issuesCurrentlyAssigned : [{
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }],
        current : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        voted : [{
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }],
        issuesAssignedToUser : [{
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }],
        issuesWatched : [{
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }]
    });
    var User = mongoose.model('User', userSchema);
    User.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    userSchema.methods.promoteToCommitter = function () {
        this.kind = "Committer";
        this.handleEvent('promoteToCommitter');
    };
    /*************************** QUERIES ***************************/
    
    userSchema.statics.current = function () {
        return cls.getNamespace('currentUser').exec();
        this.handleEvent('current');
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    userSchema.statics.getCurrent = function () {
        return cls.getNamespace('currentUser');
    };
    
    userSchema.methods.isCommitter = function () {
        return this.kind == "Committer";
    };
    
    userSchema.methods.getIssuesCurrentlyInProgress = function () {
        return Issue.filterByStatus(this.issuesAssignedToUser, null);
    };
    
    userSchema.methods.getIssuesCurrentlyAssigned = function () {
        return Issue.filterByStatus(this.issuesAssignedToUser, null);
    };
    
    userSchema.statics.isProvisioned = function () {
        return !(cls.getNamespace('currentUser') == null);
    };
    
    var exports = module.exports = User;
