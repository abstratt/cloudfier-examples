var Q = require("q");
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
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("newExpense = new Expense();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newExpense = new Expense();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newExpense['description'] = description;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newExpense['description'] = description;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newExpense['amount'] = amount;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newExpense['amount'] = amount;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newExpense['date'] = date;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newExpense['date'] = date;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newExpense['category'] = category;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newExpense['category'] = category;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newExpense['employee'] = employee;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newExpense['employee'] = employee;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newExpense.save();<NL>return q(newExpense);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newExpense.save();
            return q(newExpense);
        });
    });
};

expenseSchema.methods.approve = function () {
    var me = this;
    return Q.when(function() {
        console.log("me['approver'] = cls.getNamespace('currentUser');".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        me['approver'] = cls.getNamespace('currentUser');
    });
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("me['rejectionReason'] = reason;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            me['rejectionReason'] = reason;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("me['approver'] = cls.getNamespace('currentUser');".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            me['approver'] = cls.getNamespace('currentUser');
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
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Expense').find().where({ { 'category' : e  } : category }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return this.model('Expense').find().where({ { 'category' : e  } : category }).exec();
    });
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Expense').find().where({<NL>    $and : [ <NL>        {<NL>            $or : [ <NL>                { start : null },<NL>                {<NL>                    $gte : [ <NL>                        date,<NL>                        start<NL>                    ]<NL>                }<NL>            ]<NL>        },<NL>        {<NL>            $or : [ <NL>                { end_ : null },<NL>                {<NL>                    $lte : [ <NL>                        date,<NL>                        end_<NL>                    ]<NL>                }<NL>            ]<NL>        }<NL>    ]<NL>}).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
    var me = this;
    return Q.when(function() {
        console.log("return this.model('Expense').find().where({ status : status }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return Employee.findOne({ _id : me.employee }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Employee.findOne({ _id : me.employee }).exec();
        }),
        Q.when(function() {
            console.log("return me['amount'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me['amount'];
        }),
        Q.all([
            Q.when(function() {
                console.log("return Category.findOne({ _id : me.category }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return Category.findOne({ _id : me.category }).exec();
            }),
            Q.when(function() {
                console.log("return me['description'] + <Q>(<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return me['description'] + "(";
            })
        ]).spread(function(read_category, call_add) {
            return call_add + read_category['name'] + ")";
        }),
        Q.when(function() {
            console.log("return me['expenseId'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me['expenseId'];
        }),
        Q.when(function() {
            console.log("return me['expensePayer'];".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me['expensePayer'];
        })
    ]).spread(function(read_employee, read_amount, call_add, read_expenseId, read_expensePayer) {
        read_expensePayer.expenseApproved(read_employee['name'], read_amount, call_add, read_expenseId)
        return Q.when(null);
    });
};
/*************************** STATE MACHINE ********************/
expenseSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+"): "+ this);
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
                        var me = this;
                        return Q.when(null).then(function() {
                            return Q.when(function() {
                                console.log("me['processed'] = new Date();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                                me['processed'] = new Date();
                            });
                        }).then(function() {
                            return Q.when(function() {
                                console.log("me.reportApproved();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                                me.reportApproved();
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
                    var me = this;
                    return Q.when(null).then(function() {
                        return Q.when(function() {
                            console.log("me['processed'] = new Date();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            me['processed'] = new Date();
                        });
                    }).then(function() {
                        return Q.when(function() {
                            console.log("me.reportApproved();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                            me.reportApproved();
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
    console.log("completed handleEvent("+ event+"): "+ this);
    
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
