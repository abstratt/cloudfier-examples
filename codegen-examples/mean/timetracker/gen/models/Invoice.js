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
            // isAsynchronous: false        
            console.log("return new Date()");
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
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !isEmpty");
        return !isEmpty;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !isEmpty');\n    return !isEmpty;\n}");
        throw "Precondition on issue was violated"
    }
    console.log("this.issueDate = new Date()");
    this.issueDate = new Date();
    this.handleEvent('issue');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

invoiceSchema.virtual('number').get(function () {
    // isAsynchronous: false        
    console.log("return '' + (this.issueDate.getYear() + 1900) + '.' + this.invoiceId");
    return "" + (this.issueDate.getYear() + 1900) + "." + this.invoiceId;
});


invoiceSchema.virtual('open').get(function () {
    // isAsynchronous: false        
    console.log("return this.status == 'Preparation'");
    return this.status == "Preparation";
});

invoiceSchema.virtual('totalUnits').get(function () {
    // isAsynchronous: false        
    console.log("return Work.aggregate()n              .group({ _id: null, result: { $sum: '$units' } })n              .select('-id result')");
    return Work.aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result');
});
/*************************** PRIVATE OPS ***********************/

invoiceSchema.methods.sendInvoice = function () {
    // isAsynchronous: true        
    console.log("/*this.invoicer.invoiceIssued()*/");
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
                    // isAsynchronous: true        
                    console.log("this.sendInvoice()");
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
