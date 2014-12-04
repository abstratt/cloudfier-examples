var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Client = require('./Client.js');
var Task = require('./Task.js');

// declare schema
var invoiceSchema = new Schema({
    issueDate : {
        type : Date,
        "default" : (function() {
            /*sync*/console.log("return new Date();");
            return new Date();
        })()
    },
    status : {
        type : String,
        enum : ["Preparation", "Invoiced", "Received"],
        "default" : "Preparation"
    },
    client : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    },
    reported : [{
        type : Schema.Types.ObjectId,
        ref : "Work",
        "default" : []
    }]
});
//            invoiceSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

invoiceSchema.methods.issue = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Work, 'find', [ ({ invoice : me._id }) ]);");
            return Q.npost(Work, 'find', [ ({ invoice : me._id }) ]);
        }).then(function(reported) {
            console.log("return !(/*TBD*/isEmpty);\n");
            return !(/*TBD*/isEmpty);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Cannot issue an invoice that has no work reported. (on 'timetracker::Invoice::issue')");
            error.context = 'timetracker::Invoice::issue';
            error.constraint = 'MustHaveWork';
            error.description = 'Cannot issue an invoice that has no work reported.';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            console.log("me['issueDate'] = new Date();\n");
            me['issueDate'] = new Date();
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

invoiceSchema.methods.getNumber = function () {
    console.log("this.number: " + JSON.stringify(this));
    /*sync*/console.log("return \"\" + ( this.issueDate.getYear() + 1900) + \".\" +  this.getInvoiceId();");
    return "" + ( this.issueDate.getYear() + 1900) + "." +  this.getInvoiceId();
};


invoiceSchema.methods.isOpen = function () {
    console.log("this.open: " + JSON.stringify(this));
    /*sync*/console.log("return  this.status == \"Preparation\";");
    return  this.status == "Preparation";
};

invoiceSchema.methods.getTotalUnits = function () {
    console.log("this.totalUnits: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Work, 'find', [ ({ invoice : me._id }) ]);");
            return Q.npost(Work, 'find', [ ({ invoice : me._id }) ]);
        }).then(function(reported) {
            console.log("return Work.aggregate()\n              .group({ _id: null, result: { $sum: '$units' } })\n              .select('-id result');\n");
            return Work.aggregate()
                          .group({ _id: null, result: { $sum: '$units' } })
                          .select('-id result');
        });
    }).then(function() {
        return Q().then(function() {
            console.log(";\n");
            ;
        });
    });
};
/*************************** PRIVATE OPS ***********************/

invoiceSchema.methods.sendInvoice = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.invoicer.invoiceIssued();;");
        return me.invoicer.invoiceIssued();;
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
/*************************** STATE MACHINE ********************/
invoiceSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+")");
    switch (event) {
        case 'issue' :
            if (this.status == 'Preparation') {
                this.status = 'Invoiced';
                // on entering Invoiced
                (function() {
                    var me = this;
                    return Q().then(function() {
                        console.log("return me.sendInvoice();");
                        return me.sendInvoice();
                    });
                })();
                break;
            }
            break;
        
        case 'InvoicePaid' :
            if (this.status == 'Invoiced') {
                this.status = 'Received';
                break;
            }
            break;
    }
    console.log("completed handleEvent("+ event+")");
    return Q.npost( this, 'save', [  ]);
};

invoiceSchema.methods.issue = function () {
    return this.handleEvent('issue');
};
invoiceSchema.methods.invoicePaid = function () {
    return this.handleEvent('InvoicePaid');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Invoice', invoiceSchema);
