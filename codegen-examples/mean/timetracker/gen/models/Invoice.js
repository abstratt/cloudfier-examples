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
    var precondition = function() {
        return !(isEmpty);
    };
    if (!precondition.call(this)) {
        throw "Precondition on issue was violated"
    }
    this.issueDate = new Date();
    this.handleEvent('issue');
    return this.save();
};
/*************************** DERIVED PROPERTIES ****************/

invoiceSchema.virtual('number').get(function () {
    return "" + (this.issueDate.getYear() + 1900) + "." + this.invoiceId;
});


invoiceSchema.virtual('open').get(function () {
    return this.status == "Preparation";
});

invoiceSchema.virtual('totalUnits').get(function () {
    return getEntity('Work').aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result');
});
/*************************** PRIVATE OPS ***********************/

invoiceSchema.methods.sendInvoice = function () {
    /*this.invoicer.invoiceIssued()*/;
};
/*************************** STATE MACHINE ********************/
invoiceSchema.methods.handleEvent = function (event) {
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
};


// declare model on the schema
var exports = module.exports = mongoose.model('Invoice', invoiceSchema);
