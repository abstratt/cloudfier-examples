var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var invoiceSchema = new Schema({
    issueDate : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        enum : ["Preparation", "Invoiced", "Received"]
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
var Invoice = mongoose.model('Invoice', invoiceSchema);

/*************************** ACTIONS ***************************/

invoiceSchema.methods.issue = function () {
    this.issueDate = new Date();
    this.handleEvent('issue');
};
/*************************** DERIVED PROPERTIES ****************/

invoiceSchema.virtual('number').get(function () {
    return "" + .getYear() + "." + this.invoiceId;
});


invoiceSchema.virtual('open').get(function () {
    return this.status == null;
});

invoiceSchema.virtual('totalUnits').get(function () {
    return this.model('Work').aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result');
});
/*************************** PRIVATE OPS ***********************/

invoiceSchema.methods.sendInvoice = function () {
    this.invoicer.invoiceIssued();
    this.handleEvent('sendInvoice');
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


var exports = module.exports = Invoice;
