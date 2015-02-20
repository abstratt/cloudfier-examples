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
        enum : ["Open", "Completed", "Cancelled"],
        "default" : "Open"
    },
    openedOn : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    completedOn : {
        type : Date,
        "default" : null
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
        author : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        todo : {
            type : Schema.Types.ObjectId,
            ref : "Todo"
        }
    }]
});


/*************************** ACTIONS ***************************/

todoSchema.methods.complete = function () {
};

todoSchema.methods.cancel = function () {
};
/*************************** QUERIES ***************************/

todoSchema.statics.open = function () {
    var me = this;
    return Q().then(function() {
        return require('./Todo.js').byStatus(mongoose.model('Todo'), "Open");
    }).then(function(byStatusResult) {
        return Q.npost(byStatusResult, 'exec', [  ])
        ;
    });
};

todoSchema.statics.mine = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Todo.js'), 'find', [ ({ assignee : User.me._id }) ]);
    }).then(function(todos) {
        return Q.npost(todos, 'exec', [  ])
        ;
    });
};

todoSchema.statics.mineOpen = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Todo.js'), 'find', [ ({ assignee : User.me._id }) ]);
        }),
        Q().then(function() {
            return "Open";
        })
    ]).spread(function(todos, valueSpecificationAction) {
        return require('./Todo.js').byStatus(todos, valueSpecificationAction);
    }).then(function(byStatusResult) {
        return Q.npost(byStatusResult, 'exec', [  ])
        ;
    });
};

todoSchema.statics.openedToday = function () {
    var me = this;
    return Q().then(function() {
        return require('./Todo.js').byOpeningDate(mongoose.model('Todo'), 0);
    }).then(function(byOpeningDateResult) {
        return Q.npost(byOpeningDateResult, 'exec', [  ])
        ;
    });
};

todoSchema.statics.completedToday = function () {
    var me = this;
    return Q().then(function() {
        return require('./Todo.js').byCompletionDate(mongoose.model('Todo'), 0);
    }).then(function(byCompletionDateResult) {
        return Q.npost(byCompletionDateResult, 'exec', [  ])
        ;
    });
};
/*************************** PRIVATE OPS ***********************/

todoSchema.statics.byStatus = function (todos, status) {
    var me = this;
    return Q().then(function() {
        return todos;
    }).then(function(todos) {
        return todos.where({ status : status });
    }).then(function(selectResult) {
        return Q.npost(selectResult, 'exec', [  ])
        ;
    });
};

todoSchema.statics.byOpeningDate = function (todos, days) {
    var me = this;
    return Q().then(function() {
        return todos;
    }).then(function(todos) {
        return todos.where({
            $lte : [ 
                {
                    /*unknown:differenceInDays*/differenceInDays : [ 
                        openedOn,
                        new Date()
                    ]
                },
                days
            ]
        });
    }).then(function(selectResult) {
        return Q.npost(selectResult, 'exec', [  ])
        ;
    });
};

todoSchema.statics.byCompletionDate = function (todos, days) {
    var me = this;
    return Q().then(function() {
        return todos;
    }).then(function(todos) {
        return todos.where({
            $and : [ 
                { status : null },
                {
                    $lte : [ 
                        {
                            /*unknown:differenceInDays*/differenceInDays : [ 
                                completedOn,
                                new Date()
                            ]
                        },
                        days
                    ]
                }
            ]
        });
    }).then(function(selectResult) {
        return Q.npost(selectResult, 'exec', [  ])
        ;
    });
};
/*************************** STATE MACHINE ********************/
todoSchema.methods.handleEvent = function (event) {
    switch (event) {
        case 'complete' :
            if (this.status == 'Open') {
                this.status = 'Completed';
                // on entering Completed
                (function() {
                     this['completedOn'] = new Date();
                })();
                break;
            }
            break;
        
        case 'cancel' :
            if (this.status == 'Open') {
                this.status = 'Cancelled';
                break;
            }
            break;
    }
    return Q.npost( this, 'save', [  ]);
};

todoSchema.methods.complete = function () {
    return this.handleEvent('complete');
};
todoSchema.methods.cancel = function () {
    return this.handleEvent('cancel');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Todo', todoSchema);
