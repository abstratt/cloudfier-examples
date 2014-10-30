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
            // isAsynchronous: false        
            console.log("return new Date()");
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
    // isAsynchronous: true        
    var newExpense;
    console.log("newExpense = new Expense()");
    newExpense = new Expense();
    
    console.log("newExpense.description = description");
    newExpense.description = description;
    
    console.log("newExpense.amount = amount");
    newExpense.amount = amount;
    
    console.log("newExpense.date = date");
    newExpense.date = date;
    
    console.log("newExpense.category = category");
    newExpense.category = category;
    
    console.log("newExpense.employee = employee");
    newExpense.employee = employee;
    
    console.log("return newExpense");
    return newExpense;
};

expenseSchema.methods.approve = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !cls.getNamespace('currentUser') == this.employee");
        return !cls.getNamespace('currentUser') == this.employee;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !cls.getNamespace('currentUser') == this.employee');\n    return !cls.getNamespace('currentUser') == this.employee;\n}");
        throw "Precondition on approve was violated"
    }
    console.log("this.approver = cls.getNamespace('currentUser')");
    this.approver = cls.getNamespace('currentUser');
    this.handleEvent('approve');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.automaticApproval");
        return !this.automaticApproval;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.automaticApproval');\n    return !this.automaticApproval;\n}");
        throw "Precondition on reject was violated"
    }
    console.log("this.rejectionReason = reason");
    this.rejectionReason = reason;
    
    console.log("this.approver = cls.getNamespace('currentUser')");
    this.approver = cls.getNamespace('currentUser');
    this.handleEvent('reject');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Reconsider this expense. 
 */
expenseSchema.methods.reconsider = function () {
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.daysProcessed < 7");
        return this.daysProcessed < 7;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.daysProcessed < 7');\n    return this.daysProcessed < 7;\n}");
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
    // isAsynchronous: true        
    console.log("return this.model('Expense').find().where({ { 'category' : e  } : category }).exec()");
    return this.model('Expense').find().where({ { 'category' : e  } : category }).exec();
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    // isAsynchronous: true        
    console.log("return this.model('Expense').find().where({n    $and : [ n        {n            $or : [ n                { start : null },n                {n                    $gte : [ n                        date,n                        startn                    ]n                }n            ]n        },n        {n            $or : [ n                { end_ : null },n                {n                    $lte : [ n                        date,n                        end_n                    ]n                }n            ]n        }n    ]n}).exec()");
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
    // isAsynchronous: true        
    console.log("return this.model('Expense').find().where({ status : status }).exec()");
    return this.model('Expense').find().where({ status : status }).exec();
};
/*************************** DERIVED PROPERTIES ****************/

expenseSchema.virtual('moniker').get(function () {
    // isAsynchronous: false        
    console.log("return this.description + ' on ' + this.date");
    return this.description + " on " + this.date;
});


/**
 *  Whether this expense qualifies for automatic approval. 
 */
expenseSchema.virtual('automaticApproval').get(function () {
    // isAsynchronous: false        
    console.log("return this.amount < 50");
    return this.amount < 50;
});

expenseSchema.virtual('daysProcessed').get(function () {
    // isAsynchronous: false        
    if (this.processed == null) {
        console.log("return 0");
        return 0;
    } else  {
        console.log("return (this.processed - new Date()) / (1000*60*60*24)");
        return (this.processed - new Date()) / (1000*60*60*24);
    }
});
/*************************** PRIVATE OPS ***********************/

expenseSchema.methods.reportApproved = function () {
    // isAsynchronous: true        
    console.log("/*this.expensePayer.expenseApproved(this.employee.name, this.amount, this.description + '(' + this.category.name + ')', this.expenseId)*/");
    /*this.expensePayer.expenseApproved(this.employee.name, this.amount, this.description + "(" + this.category.name + ")", this.expenseId)*/;
};
/*************************** STATE MACHINE ********************/
expenseSchema.methods.handleEvent = function (event) {
    var guard;
    switch (event) {
        case 'submit' :
            if (this.status == 'Draft') {
                guard = function() {
                    // isAsynchronous: false        
                    console.log("return this.automaticApproval");
                    return this.automaticApproval;
                };
                if (guard.call(this)) {
                    this.status = 'Approved';
                    // on entering Approved
                    (function() {
                        // isAsynchronous: true        
                        console.log("this.processed = new Date()");
                        this.processed = new Date();
                        
                        console.log("this.reportApproved()");
                        this.reportApproved();
                    })();
                    return;
                }
            }
            if (this.status == 'Draft') {
                guard = function() {
                    // isAsynchronous: false        
                    console.log("return !this.automaticApproval");
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
                    // isAsynchronous: true        
                    console.log("this.processed = new Date()");
                    this.processed = new Date();
                    
                    console.log("this.reportApproved()");
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
                    // isAsynchronous: true        
                    console.log("this.processed = new Date()");
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
