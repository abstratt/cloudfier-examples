var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');

// declare schema
var todoSchema = new Schema({
    description : {
        type : String,
        "default" : null
    },
    details : {
        type : String,
        "default" : null
    },
    status : {
        type : String,
        enum : ["Open", "Done", "Cancelled"],
        "default" : "Open"
    },
    assignee : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    creator : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    comments : [{
        text : {
            type : String,
            "default" : null
        },
        commenter : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }]
});
//            todoSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

todoSchema.methods.complete = function () {
    var me = this;
    return Q().then(function() {
        console.log("me['status'] = \"Done\";\n");
        me['status'] = "Done";
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

// declare model on the schema
var exports = module.exports = mongoose.model('Todo', todoSchema);
