var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Client = require('./Client.js');
var Task = require('./Task.js');

// declare schema
var invoiceSchema = new Schema({
    issueDate : {
        type : Date,
        "default" : (function() {
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

/*************************** ACTIONS ***************************/

invoiceSchema.methods.issue = function () {
    var me = this;
    return Q().then(function() {
        console.log("me['issueDate'] = new Date();\n");
        me['issueDate'] = new Date();
    }).then(function() {
        return me.save();
    });
};
/*************************** DERIVED PROPERTIES ****************/

invoiceSchema.virtual('number').get(function () {
    return "" + (this['issueDate'].getYear() + 1900) + "." + this['invoiceId'];
});


invoiceSchema.virtual('open').get(function () {
    return this['status'] == "Preparation";
});

invoiceSchema.virtual('totalUnits').get(function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Work, 'find', [ ({ invoice : me._id }) ]);");
            return Q.npost(Work, 'find', [ ({ invoice : me._id }) ]);
        }).then(function(reported) {
            console.log(reported);
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
});
/*************************** PRIVATE OPS ***********************/

invoiceSchema.methods.sendInvoice = function () {
    this['invoicer'].invoiceIssued();;
};
/*************************** STATE MACHINE ********************/
invoiceSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+"): "+ this);
    switch (event) {
        case 'issue' :
            if (this.status == 'Preparation') {
                this.status = 'Invoiced';
                // on entering Invoiced
                (function() {
                    this.sendInvoice();
                })();
                return;
            }
            break;
        
        case 'InvoicePaid' :
            if (this.status == 'Invoiced') {
                this.status = 'Received';
                return;
            }
            break;
    }
    console.log("completed handleEvent("+ event+"): "+ this);
    
};

invoiceSchema.methods.issue = function () {
    this.handleEvent('issue');
};
invoiceSchema.methods.invoicePaid = function () {
    this.handleEvent('InvoicePaid');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Invoice', invoiceSchema);
