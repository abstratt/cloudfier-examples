    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var invoiceSchema = new Schema({
        number : {
            type : String
        },
        invoiceId : {
            type : Number
        },
        issueDate : {
            type : Date,
            required : true
        },
        open : {
            type : Boolean
        },
        status : {
            type : String,
            enum : ["Preparation", "Invoiced", "Received"]
        },
        totalUnits : {
            type : Number
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
    Invoice.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    invoiceSchema.methods.issue = function () {
        this.issueDate = new Date();
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    invoiceSchema.methods.getNumber = function () {
        return "" +  + "." + this.invoiceId;
    };
    
    
    invoiceSchema.methods.isOpen = function () {
        return this.status == null;
    };
    
    invoiceSchema.methods.getTotalUnits = function () {
        return this.model('Work').aggregate()
                      .group({ _id: null, result: { $sum: '$units' } })
                      .select('-id result');
    };
    /*************************** PRIVATE OPS ***********************/
    
    invoiceSchema.methods.sendInvoice = function () {
        this.invoicer.invoiceIssued();
    };
    /*************************** STATE MACHINE ********************/
    Invoice.emitter.on('issue', function () {
        if (this.status == 'Preparation') {
            this.status = 'Invoiced';
            (function() {
                this.sendInvoice();
            })();
            return;
        }
    });     
    
    Invoice.emitter.on('InvoicePaid', function () {
        if (this.status == 'Invoiced') {
            this.status = 'Received';
            return;
        }
    });     
    
    
    var exports = module.exports = Invoice;
