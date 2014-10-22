var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Employee = require('./Employee.js');
var Category = require('./Category.js');

/**
 *  The expense as reported by an employee. 
 */
// declare schema
var expenseSchema = new Schema({
    description : {
        type : String,
        default : null
    },
    status : {
        type : String,
        enum : ["Draft", "Submitted", "Approved", "Rejected"],
        default : "Draft"
    },
    amount : {
        type : Number,
        default : 0
    },
    date : {
        type : Date,
        default : (function() {
            return new Date();
        })()
    },
    processed : {
        type : Date,
        default : new Date()
    },
    rejectionReason : {
        type : String,
        default : null
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

/*************************** ACTIONS ***************************/

expenseSchema.statics.newExpense = function (description, amount, date, category, employee) {
    var newExpense;
    newExpense = new Expense();
    newExpense.description = description;
    newExpense.amount = amount;
    newExpense.date = date;
    newExpense.category = category;
    newExpense.employee = employee;
    return newExpense;
};

expenseSchema.methods.approve = function () {
    var precondition = function() {
        return !cls.getNamespace('currentUser') == this.employee;
    };
    if (!precondition.call(this)) {
        throw "Precondition on approve was violated"
    }
    this.approver = cls.getNamespace('currentUser');
    this.handleEvent('approve');
    return this.save();
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    var precondition = function() {
        return !this.automaticApproval;
    };
    if (!precondition.call(this)) {
        throw "Precondition on reject was violated"
    }
    this.rejectionReason = reason;
    this.approver = cls.getNamespace('currentUser');
    this.handleEvent('reject');
    return this.save();
};

/**
 *  Reconsider this expense. 
 */
expenseSchema.methods.reconsider = function () {
    var precondition = function() {
        return this.daysProcessed < 7;
    };
    if (!precondition.call(this)) {
        throw "Precondition on reconsider was violated"
    }
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
    return Expense.find().where('category').eq(category).exec();
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    return Expense.find()start.eq(null).or(.where('date').gte(start)).and(end_.eq(null).or(.where('date').lte(end_))).exec();
};

expenseSchema.statics.findByStatus = function (status) {
    return Expense.find().where('status').eq(status).exec();
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
    /*this.expensePayer.expenseApproved(this.employee.name, this.amount, this.description + "(" + this.category.name + ")", this.expenseId)*/;
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
                if (guard.call(this)) {
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
                    return !this.automaticApproval;
                };
                if (guard.call(this)) {
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


// declare model on the schema
var exports = module.exports = mongoose.model('Expense', expenseSchema);
