var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Todo = require('./Todo.js');

// declare schema
var userSchema = new Schema({
    email : {
        type : String,
        "default" : null
    },
    name : {
        type : String,
        "default" : null
    },
    todos : [{
        type : Schema.Types.ObjectId,
        ref : "Todo",
        "default" : []
    }]
});


/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.methods.getOpenTodos = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Todo.js'), 'find', [ ({ assignee : me._id }) ]);
        }),
        Q().then(function() {
            return "Open";
        })
    ]).spread(function(todos, valueSpecificationAction) {
        return require('./Todo.js').byStatus(todos, valueSpecificationAction);
    }).then(function(byStatusResult) {
        return byStatusResult;
    });
};

userSchema.statics.getMe = function () {
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
