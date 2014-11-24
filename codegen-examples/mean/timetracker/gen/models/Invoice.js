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
        required : true,
        default : (function() {
            return new Date();
        })()
    },
    status : {
        type : String,
        enum : ["Preparation", "Invoiced", "Received"],
        default : "Preparation"
    },
    client : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    },
    reported : [{
        type : Schema.Types.ObjectId,
        ref : "Work"
    }]
});

/*************************** ACTIONS ***************************/

invoiceSchema.methods.issue = function () {
    var me = this;
    return Q.when(function() {
        console.log("me['issueDate'] = new Date();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['issueDate'] = new Date();
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
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("return Work.find({ invoice : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Work.find({ invoice : me._id }).exec();
        }).then(function(read_reported) {
            return Work.aggregate()
                          .group({ _id: null, result: { $sum: '$units' } })
                          .select('-id result');
        });
    }).then(function() {
        return Q.when(function() {
            console.log(";".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            ;
        });
    });
});
/*************************** PRIVATE OPS ***********************/

invoiceSchema.methods.sendInvoice = function () {
    this['invoicer'].invoiceIssued();
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
