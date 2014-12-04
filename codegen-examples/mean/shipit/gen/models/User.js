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
                console.log("return User.current();");
                return User.current();
            }),
            Q().then(function() {
                console.log("return User.current();");
                return User.current();
            }).then(function(current) {
                console.log("return Unsupported classifier Basic for operation notNull;");
                return Unsupported classifier Basic for operation notNull;
            })
        ]).spread(function(current, notNull) {
            console.log("current:" + current);console.log("notNull:" + notNull);
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
            console.log("me['kind'] = \"Committer\";\n");
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
            console.log("return Q.npost(cls.getNamespace('currentUser'), 'exec', [  ])\n;\n");
            return Q.npost(cls.getNamespace('currentUser'), 'exec', [  ])
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log(";\n");
            ;
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

userSchema.methods.isCommitter = function () {
    console.log("this.committer: " + JSON.stringify(this));
    /*sync*/console.log("return  this.kind == \"Committer\";");
    return  this.kind == "Committer";
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.methods.getIssuesCurrentlyInProgress = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Issue, 'find', [ ({ assignee : me._id }) ]);");
            return Q.npost(Issue, 'find', [ ({ assignee : me._id }) ]);
        }),
        Q().then(function() {
            console.log("return \"InProgress\";");
            return "InProgress";
        })
    ]).spread(function(issuesAssignedToUser, valueSpecificationAction) {
        console.log("issuesAssignedToUser:" + issuesAssignedToUser);console.log("valueSpecificationAction:" + valueSpecificationAction);
        return Issue.filterByStatus(issuesAssignedToUser, valueSpecificationAction);
    }).then(function(filterByStatus) {
        console.log("return filterByStatus;\n");
        return filterByStatus;
    });
};

userSchema.methods.getIssuesCurrentlyAssigned = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return Q.npost(Issue, 'find', [ ({ assignee : me._id }) ]);");
            return Q.npost(Issue, 'find', [ ({ assignee : me._id }) ]);
        }),
        Q().then(function() {
            console.log("return \"Assigned\";");
            return "Assigned";
        })
    ]).spread(function(issuesAssignedToUser, valueSpecificationAction) {
        console.log("issuesAssignedToUser:" + issuesAssignedToUser);console.log("valueSpecificationAction:" + valueSpecificationAction);
        return Issue.filterByStatus(issuesAssignedToUser, valueSpecificationAction);
    }).then(function(filterByStatus) {
        console.log("return filterByStatus;\n");
        return filterByStatus;
    });
};

userSchema.statics.getCurrent = function () {
    /*sync*/console.log("return cls.getNamespace('currentUser');");
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
