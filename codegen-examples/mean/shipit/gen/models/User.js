var q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Label = require('./Label.js');
var Project = require('./Project.js');
var Issue = require('./Issue.js');

// declare schema
var userSchema = new Schema({
    email : {
        type : String,
        default : null
    },
    fullName : {
        type : String,
        required : true,
        default : null
    },
    kind : {
        type : String,
        enum : ["Reporter", "Committer"],
        default : "Reporter"
    },
    issuesReportedByUser : [{
        type : Schema.Types.ObjectId,
        ref : "Issue"
    }],
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

/*************************** ACTIONS ***************************/

userSchema.methods.promoteToCommitter = function () {
    return q().then(function() {
        this['kind'] = "Committer";
    });
};
/*************************** QUERIES ***************************/

userSchema.statics.current = function () {
    return q().then(function() {
        return q().then(function() {
            return cls.getNamespace('currentUser').exec();
        });
    }).then(function() {
        return q().then(function() {
            ;
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

userSchema.virtual('committer').get(function () {
    return this['kind'] == "Committer";
});
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.methods.getIssuesCurrentlyInProgress = function () {
    return q().all([
        q().then(function() {
            return Issue.findOne({ _id : this.issuesAssignedToUser }).exec();
        }), q().then(function() {
            return "InProgress";
        })
    ]).spread(function(read_issuesAssignedToUser, valueSpecificationAction) {
        return Issue.filterByStatus(read_issuesAssignedToUser, valueSpecificationAction);
    }).then(function(call_filterByStatus) {
        return call_filterByStatus;
    });
};

userSchema.methods.getIssuesCurrentlyAssigned = function () {
    return q().all([
        q().then(function() {
            return Issue.findOne({ _id : this.issuesAssignedToUser }).exec();
        }), q().then(function() {
            return "Assigned";
        })
    ]).spread(function(read_issuesAssignedToUser, valueSpecificationAction) {
        return Issue.filterByStatus(read_issuesAssignedToUser, valueSpecificationAction);
    }).then(function(call_filterByStatus) {
        return call_filterByStatus;
    });
};

userSchema.statics.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
