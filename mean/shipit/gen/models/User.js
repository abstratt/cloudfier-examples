var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Label = require('./Label.js');
var Project = require('./Project.js');
var Issue = require('./Issue.js');

// declare schema
var userSchema = new Schema({
    email : {
        type : String,
        "default" : null
    },
    fullName : {
        type : String,
        "default" : null
    },
    kind : {
        type : String,
        enum : ["Reporter", "Committer"],
        "default" : "Reporter"
    },
    issuesReportedByUser : [{
        type : Schema.Types.ObjectId,
        ref : "Issue",
        "default" : []
    }],
    voted : [{
        type : Schema.Types.ObjectId,
        ref : "Issue",
        "default" : []
    }],
    issuesAssignedToUser : [{
        type : Schema.Types.ObjectId,
        ref : "Issue",
        "default" : []
    }],
    issuesWatched : [{
        type : Schema.Types.ObjectId,
        ref : "Issue",
        "default" : []
    }]
});
//            userSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

userSchema.methods.promoteToCommitter = function () {
    var me = this;
    return Q().then(function() {
        return Q.all([
            Q().then(function() {
                return User.current();
            }),
            Q().then(function() {
                return User.current();
            }).then(function(current) {
                return Unsupported classifier Basic for operation notNull;
            })
        ]).spread(function(current, notNull) {
            return notNull && current.isCommitter();
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'shipit::User::promoteToCommitter')");
            error.context = 'shipit::User::promoteToCommitter';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            me['kind'] = "Committer";
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
/*************************** QUERIES ***************************/

userSchema.statics.current = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return Q.npost(cls.getNamespace('currentUser'), 'exec', [  ])
            ;
        });
    }).then(function() {
        return Q().then(function() {
            ;
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

userSchema.methods.isCommitter = function () {
    /*sync*/return  this.kind == "Committer";
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.methods.getIssuesCurrentlyInProgress = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(Issue, 'find', [ ({ assignee : me._id }) ]);
        }),
        Q().then(function() {
            return "InProgress";
        })
    ]).spread(function(issuesAssignedToUser, valueSpecificationAction) {
        return Issue.filterByStatus(issuesAssignedToUser, valueSpecificationAction);
    }).then(function(filterByStatus) {
        return filterByStatus;
    });
};

userSchema.methods.getIssuesCurrentlyAssigned = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(Issue, 'find', [ ({ assignee : me._id }) ]);
        }),
        Q().then(function() {
            return "Assigned";
        })
    ]).spread(function(issuesAssignedToUser, valueSpecificationAction) {
        return Issue.filterByStatus(issuesAssignedToUser, valueSpecificationAction);
    }).then(function(filterByStatus) {
        return filterByStatus;
    });
};

userSchema.statics.getCurrent = function () {
    /*sync*/return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
