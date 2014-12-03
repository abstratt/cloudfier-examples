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
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
};
/*************************** QUERIES ***************************/

userSchema.statics.current = function () {
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

userSchema.virtual('committer').get(function () {
    return this.kind == "Committer";
});
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
        return Issue.filterByStatus(issuesAssignedToUser, valueSpecificationAction);
    }).then(function(filterByStatus) {
        console.log("return filterByStatus;\n");
        return filterByStatus;
    });
};

userSchema.statics.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
