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
    var newExpense;
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            newExpense = new Expense();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newExpense['description'] = description;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newExpense['amount'] = amount;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newExpense['date'] = date;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newExpense['category'] = category;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newExpense['employee'] = employee;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newExpense.save();
            return q(newExpense);
        });
    });
};

expenseSchema.methods.approve = function () {
    return q(/*leaf*/).then(function() {
        this['approver'] = cls.getNamespace('currentUser');
    });
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            this['rejectionReason'] = reason;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            this['approver'] = cls.getNamespace('currentUser');
        });
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
    return q(/*leaf*/).then(function() {
        return this.model('Expense').find().where({ { 'category' : e  } : category }).exec();
    });
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    return q(/*leaf*/).then(function() {
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
    });
};

expenseSchema.statics.findByStatus = function (status) {
    return q(/*leaf*/).then(function() {
        return this.model('Expense').find().where({ status : status }).exec();
    });
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
    return q(/*parallel*/).all([
        q(/*leaf*/).then(function() {
            return Employee.find({ _id : this.employee }).exec();
        }), q(/*leaf*/).then(function() {
            return this['amount'];
        }), q(/*parallel*/).all([
            q(/*leaf*/).then(function() {
                return Category.findOne({ _id : this.category }).exec();
            }), q(/*leaf*/).then(function() {
                return this['description'] + "(";
            })
        ]).spread(function(read_category, call_add) {
            return call_add + read_category['name'] + ")";
        }), q(/*leaf*/).then(function() {
            return this['expenseId'];
        }), q(/*leaf*/).then(function() {
            return this['expensePayer'];
        })
    ]).spread(function(read_employee, read_amount, call_add, read_expenseId, read_expensePayer) {
        read_expensePayer.expenseApproved(read_employee['name'], read_amount, call_add, read_expenseId);
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
                        return q(/*sequential*/).then(function() {
                            return q(/*leaf*/).then(function() {
                                this['processed'] = new Date();
                            });
                        }).then(function() {
                            return q(/*leaf*/).then(function() {
                                this.reportApproved();
                            });
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
                    return q(/*sequential*/).then(function() {
                        return q(/*leaf*/).then(function() {
                            this['processed'] = new Date();
                        });
                    }).then(function() {
                        return q(/*leaf*/).then(function() {
                            this.reportApproved();
                        });
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
