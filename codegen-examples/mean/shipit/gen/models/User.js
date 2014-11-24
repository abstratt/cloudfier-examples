var Q = require("q");
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
    var me = this;
    return Q.when(function() {
        console.log("me['kind'] = <Q>Committer<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['kind'] = "Committer";
    });
};
/*************************** QUERIES ***************************/

userSchema.statics.current = function () {
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("return cls.getNamespace('currentUser').exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return cls.getNamespace('currentUser').exec();
        });
    }).then(function() {
        return Q.when(function() {
            console.log(";".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Issue.find({ assignee : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Issue.find({ assignee : me._id }).exec();
        }),
        Q.when(function() {
            console.log("return <Q>InProgress<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return "InProgress";
        })
    ]).spread(function(read_issuesAssignedToUser, valueSpecificationAction) {
        return Issue.filterByStatus(read_issuesAssignedToUser, valueSpecificationAction);
    }).then(function(call_filterByStatus) {
        return call_filterByStatus;
    });
};

userSchema.methods.getIssuesCurrentlyAssigned = function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Issue.find({ assignee : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Issue.find({ assignee : me._id }).exec();
        }),
        Q.when(function() {
            console.log("return <Q>Assigned<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
