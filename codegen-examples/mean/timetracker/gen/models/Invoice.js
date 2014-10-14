    var EventEmitter = require('events').EventEmitter;        

    var invoiceSchema = new Schema({
        number : String,
        invoiceId : Number,
        issueDate : Date,
        open : Boolean,
        status : Status,
        totalUnits : Number
    });
    
    /*************************** ACTIONS ***************************/
    
    invoiceSchema.methods.issue = function () {
        this.issueDate = new Date();
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    invoiceSchema.methods.getNumber = function () {
        return "" +  + "." + this.invoiceId;
    };
    
    
    invoiceSchema.methods.getOpen = function () {
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
    
    var Invoice = mongoose.model('Invoice', invoiceSchema);
    Invoice.emitter = new EventEmitter();