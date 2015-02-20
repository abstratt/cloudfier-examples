var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Client = require('./Client.js');
var Invoice = require('./Invoice.js');
var Task = require('./Task.js');

// declare schema
var workSchema = new Schema({
    units : {
        type : Number,
        "default" : 0
    },
    date : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    memo : {
        type : String,
        "default" : null
    },
    task : {
        type : Schema.Types.ObjectId,
        ref : "Task"
    },
    invoice : {
        type : Schema.Types.ObjectId,
        ref : "Invoice"
    }
});

/*************************** INVARIANTS ***************************/

workSchema.path('units').validate(
    function() {
        return  this.units > 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** ACTIONS ***************************/

/**
 *  Submits this work to a chosen invoice for the client. 
 */
workSchema.methods.submit = function (invoice) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isInvoiced();
        }).then(function(invoiced) {
            return !(invoiced);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: AlreadyInvoiced (on 'timetracker::Work::submit')");
            error.context = 'timetracker::Work::submit';
            error.constraint = 'AlreadyInvoiced';
            throw error;
        }    
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return Q.npost(require('./Invoice.js'), 'findOne', [ ({ _id : invoice._id }) ]);
            }).then(function(invoice) {
                return Q.npost(require('./Client.js'), 'findOne', [ ({ _id : invoice.client }) ]);
            }),
            Q().then(function() {
                return Q.npost(require('./Task.js'), 'findOne', [ ({ _id : me.task }) ]);
            }).then(function(task) {
                return Q.npost(require('./Client.js'), 'findOne', [ ({ _id : task.client }) ]);
            })
        ]).spread(function(client, client) {
            return client == client;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: WrongClient (on 'timetracker::Work::submit')");
            error.context = 'timetracker::Work::submit';
            error.constraint = 'WrongClient';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q.npost(require('./Invoice.js'), 'findOne', [ ({ _id : invoice._id }) ]);
        }).then(function(invoice) {
            return invoice.isOpen();
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: InvoiceNotOpen (on 'timetracker::Work::submit')");
            error.context = 'timetracker::Work::submit';
            error.constraint = 'InvoiceNotOpen';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q().then(function() {
            return Q.npost(require('./Invoice.js'), 'findOne', [ ({ _id : invoice._id }) ]);
        }).then(function(invoice) {
            me.invoice = invoice._id;
            invoice.reported.push(me._id);
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
/*************************** DERIVED PROPERTIES ****************/

workSchema.methods.isInvoiced = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Invoice.js'), 'findOne', [ ({ _id : me.invoice }) ]);
        }),
        Q().then(function() {
            return null;
        })
    ]).spread(function(invoice, valueSpecificationAction) {
        return !(invoice == valueSpecificationAction);
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

workSchema.methods.getClient = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Task.js'), 'findOne', [ ({ _id : me.task }) ]);
    }).then(function(task) {
        return Q.npost(require('./Client.js'), 'findOne', [ ({ _id : task.client }) ]);
    }).then(function(client) {
        return client;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Work', workSchema);
