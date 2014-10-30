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
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return Unsupported classifier Basic for operation notNull && User.current().committer");
        return Unsupported classifier Basic for operation notNull && User.current().committer;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return Unsupported classifier Basic for operation notNull && User.current().committer');\n    return Unsupported classifier Basic for operation notNull && User.current().committer;\n}");
        throw "Precondition on promoteToCommitter was violated"
    }
    console.log("this.kind = 'Committer'");
    this.kind = "Committer";
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** QUERIES ***************************/

userSchema.statics.current = function () {
    // isAsynchronous: false        
    console.log("return cls.getNamespace('currentUser').exec()");
    return cls.getNamespace('currentUser').exec();
};
/*************************** DERIVED PROPERTIES ****************/

userSchema.virtual('committer').get(function () {
    // isAsynchronous: false        
    console.log("return this.kind == 'Committer'");
    return this.kind == "Committer";
});
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.methods.getIssuesCurrentlyInProgress = function () {
    // isAsynchronous: false        
    console.log("return Issue.filterByStatus(this.issuesAssignedToUser, 'InProgress')");
    return Issue.filterByStatus(this.issuesAssignedToUser, "InProgress");
};

userSchema.methods.getIssuesCurrentlyAssigned = function () {
    // isAsynchronous: false        
    console.log("return Issue.filterByStatus(this.issuesAssignedToUser, 'Assigned')");
    return Issue.filterByStatus(this.issuesAssignedToUser, "Assigned");
};

userSchema.statics.getCurrent = function () {
    // isAsynchronous: false        
    console.log("return cls.getNamespace('currentUser')");
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
