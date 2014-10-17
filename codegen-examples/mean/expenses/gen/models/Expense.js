var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  The expense as reported by an employee. 
 */
var expenseSchema = new Schema({
    description : {
        type : String
    },
    status : {
        type : String,
        enum : ["Draft", "Submitted", "Approved", "Rejected"]
    },
    amount : {
        type : Number
    },
    date : {
        type : Date
    },
    processed : {
        type : Date
    },
    rejectionReason : {
        type : String
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : "Category"
    },
    employee : {
        type : Schema.Types.ObjectId,
        ref : "Employee"
    },
    approver : {
        type : Schema.Types.ObjectId,
        ref : "Employee"
    }
});
var Expense = mongoose.model('Expense', expenseSchema);

/*************************** ACTIONS ***************************/

expenseSchema.statics.newExpense = function (description, amount, date, category, employee) {
    var newExpense = new Expense();
    newExpense.description = description;
    newExpense.amount = amount;
    newExpense.date = date;
    newExpense.category = category;
    newExpense.employee = employee;
    return newExpense;
};

expenseSchema.methods.approve = function () {
    this.approver = cls.getNamespace('currentUser');
    this.handleEvent('approve');
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    this.rejectionReason = reason;
    this.approver = cls.getNamespace('currentUser');
    this.handleEvent('reject');
};

/**
 *  Reconsider this expense. 
 */
expenseSchema.methods.reconsider = function () {
    this.handleEvent('reconsider');    
};

/**
 *  Sends this expense back to Draft state. 
 */
expenseSchema.methods.review = function () {
    this.handleEvent('review');    
};

/**
 *  Submit this expense. 
 */
expenseSchema.methods.submit = function () {
    this.handleEvent('submit');    
};
/*************************** QUERIES ***************************/

expenseSchema.statics.findExpensesByCategory = function (category) {
    return this.model('Expense').find().where('category').eq(category).exec();
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    return this.model('Expense').find()start.eq(null).or(.where('date').gte(start)).and(end_.eq(null).or(.where('date').lte(end_))).exec();
};

expenseSchema.statics.findByStatus = function (status) {
    return this.model('Expense').find().where('status').eq(status).exec();
};
/*************************** DERIVED PROPERTIES ****************/

expenseSchema.virtual('moniker').get(function () {
    return this.description + " on " + this.date;
});


/**
 *  Whether this expense qualifies for automatic approval. 
 */
expenseSchema.virtual('automaticApproval').get(function () {
    return this.amount < 50;
});

expenseSchema.virtual('daysProcessed').get(function () {
    if (this.processed == null) {
        return 0;
    } else  {
        return (this.processed - new Date()) / (1000*60*60*24);
    }
});
/*************************** PRIVATE OPS ***********************/

expenseSchema.methods.reportApproved = function () {
    this.expensePayer.expenseApproved(this.employee.name, this.amount, this.description + "(" + this.category.name + ")", this.expenseId);
    this.handleEvent('reportApproved');
};
/*************************** STATE MACHINE ********************/
expenseSchema.methods.handleEvent = function (event) {
    var guard;
    switch (event) {
        case 'submit' :
            if (this.status == 'Draft') {
                guard = function() {
                    return this.automaticApproval;
                };
                if (guard()) {
                    this.status = 'Approved';
                    // on entering Approved
                    (function() {
                        this.processed = new Date();
                        this.reportApproved();
                    })();
                    return;
                }
            }
            if (this.status == 'Draft') {
                guard = function() {
                    return !(this.automaticApproval);
                };
                if (guard()) {
                    this.status = 'Submitted';
                    return;
                }
            }
            break;
        
        case 'approve' :
            if (this.status == 'Submitted') {
                this.status = 'Approved';
                // on entering Approved
                (function() {
                    this.processed = new Date();
                    this.reportApproved();
                })();
                return;
            }
            break;
        
        case 'review' :
            if (this.status == 'Submitted') {
                this.status = 'Draft';
                return;
            }
            break;
        
        case 'reject' :
            if (this.status == 'Submitted') {
                this.status = 'Rejected';
                // on entering Rejected
                (function() {
                    this.processed = new Date();
                })();
                return;
            }
            break;
        
        case 'reconsider' :
            if (this.status == 'Rejected') {
                this.status = 'Submitted';
                return;
            }
            break;
    }
};


var exports = module.exports = Expense;
