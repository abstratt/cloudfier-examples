var q = require("q");
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
    return q().then(function() {
        var newExpense;
        newExpense = new Expense();
        newExpense['description'] = description;
        newExpense['amount'] = amount;
        newExpense['date'] = date;
        newExpense['category'] = category;
        newExpense['employee'] = employee;
        return newExpense.save();
    });
};

expenseSchema.methods.approve = function () {
    return q().then(function() {
        this['approver'] = cls.getNamespace('currentUser');
    });
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    return q().then(function() {
        this['rejectionReason'] = reason;
        this['approver'] = cls.getNamespace('currentUser');
    });
};

/**
 *  Reconsider this expense. 
 */
expenseSchema.methods.reconsider = function () {
};

/**
 *  Sends this expense back to Draft state. 
 */
expenseSchema.methods.review = function () {
};

/**
 *  Submit this expense. 
 */
expenseSchema.methods.submit = function () {
};
/*************************** QUERIES ***************************/

expenseSchema.statics.findExpensesByCategory = function (category) {
    return q().then(function() {
        return this.model('Expense').find().where({ { 'category' : e  } : category }).exec();
    });
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    return this.model('Expense').find().where({
        $and : [ 
            {
                $or : [ 
                    { start : null },
                    {
                        $gte : [ 
                            date,
                            start
                        ]
                    }
                ]
            },
            {
                $or : [ 
                    { end_ : null },
                    {
                        $lte : [ 
                            date,
                            end_
                        ]
                    }
                ]
            }
        ]
    }).exec();
};

expenseSchema.statics.findByStatus = function (status) {
    return this.model('Expense').find().where({ status : status }).exec();
};
/*************************** DERIVED PROPERTIES ****************/

expenseSchema.virtual('moniker').get(function () {
    return this['description'] + " on " + this['date'];
});


/**
 *  Whether this expense qualifies for automatic approval. 
 */
expenseSchema.virtual('automaticApproval').get(function () {
    return this['amount'] < 50;
});

expenseSchema.virtual('daysProcessed').get(function () {
    if (this['processed'] == null) {
        return 0;
    } else  {
        return (this['processed'] - new Date()) / (1000*60*60*24);
    }
});
/*************************** PRIVATE OPS ***********************/

expenseSchema.methods.reportApproved = function () {
    return q().all([q().then(function() {
        return Employee.find({ _id : this.employee }).exec();
    }), q().then(function() {
        return Category.findOne({ _id : this.category }).exec();
    })]).spread(function(employee, category) {
        this['expensePayer'].expenseApproved(employee['name'], this['amount'], this['description'] + "(" + category['name'] + ")", this['expenseId']);
    });
};
/*************************** STATE MACHINE ********************/
expenseSchema.methods.handleEvent = function (event) {
    var guard;
    switch (event) {
        case 'submit' :
            if (this.status == 'Draft') {
                guard = function() {
                    return this['automaticApproval'];
                }
                ;
                if (guard.call(this)) {
                    this.status = 'Approved';
                    // on entering Approved
                    (function() {
                        return q().then(function() {
                            this.reportApproved()
                        }).then(function(reportApproved) {
                            this['processed'] = new Date();
                            reportApproved;
                        });
                    })();
                    return;
                }
            }
            if (this.status == 'Draft') {
                guard = function() {
                    return !this['automaticApproval'];
                }
                ;
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
                    return q().then(function() {
                        this.reportApproved()
                    }).then(function(reportApproved) {
                        this['processed'] = new Date();
                        reportApproved;
                    });
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
                    this['processed'] = new Date();
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

expenseSchema.methods.submit = function () {
    this.handleEvent('submit');
};
expenseSchema.methods.approve = function () {
    this.handleEvent('approve');
};
expenseSchema.methods.review = function () {
    this.handleEvent('review');
};
expenseSchema.methods.reject = function () {
    this.handleEvent('reject');
};
expenseSchema.methods.reconsider = function () {
    this.handleEvent('reconsider');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Expense', expenseSchema);
