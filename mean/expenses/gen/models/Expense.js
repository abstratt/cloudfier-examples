var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : null
    },
    status : {
        type : String,
        enum : ["Draft", "Submitted", "Approved", "Rejected"],
        "default" : "Draft"
    },
    amount : {
        type : Number,
        "default" : null
    },
    date : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    processed : {
        type : Date,
        "default" : null
    },
    rejectionReason : {
        type : String,
        "default" : null
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
    return Q().then(function() {
        return Q().then(function() {
            newExpense = new require('./Expense.js')();
        });
    }).then(function() {
        return Q().then(function() {
            newExpense['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            newExpense['amount'] = amount;
        });
    }).then(function() {
        return Q().then(function() {
            newExpense['date'] = date;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(require('./Category.js'), 'findOne', [ ({ _id : category._id }) ]);
        }).then(function(category) {
            newExpense.category = category._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(require('./Employee.js'), 'findOne', [ ({ _id : employee._id }) ]);
        }).then(function(employee) {
            newExpense.employee = employee._id;
            employee.expenses.push(newExpense._id);
        });
    }).then(function() {
        return Q().then(function() {
            return newExpense;
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(newExpense, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    });
};

expenseSchema.methods.approve = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return Q.npost(require('./Employee.js'), 'findOne', [ ({ _id : me.employee }) ]);
        }).then(function(employee) {
            return !(cls.getNamespace('currentUser') == employee);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Cannot approve own expenses. (on 'expenses::Expense::approve')");
            error.context = 'expenses::Expense::approve';
            error.constraint = '';
            error.description = 'Cannot approve own expenses.';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q().then(function() {
            me.approver = cls.getNamespace('currentUser')._id
            ;
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
    });
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    var me = this;
    return Q().then(function() {
        return !(me.isAutomaticApproval());
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Cannot reject an expense under the auto-approval limit. (on 'expenses::Expense::reject')");
            error.context = 'expenses::Expense::reject';
            error.constraint = '';
            error.description = 'Cannot reject an expense under the auto-approval limit.';
            throw error;
        }    
    }).then(function(/*noargs*/) {
        return Q().then(function() {
            return Q().then(function() {
                me['rejectionReason'] = reason;
            });
        }).then(function() {
            return Q().then(function() {
                me.approver = cls.getNamespace('currentUser')._id
                ;
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
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
    return Q().then(function() {
        return mongoose.model('Expense').where({ category : category });
    }).then(function(selectResult) {
        return Q.npost(selectResult, 'exec', [  ])
        ;
    });
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    var me = this;
    return Q().then(function() {
        return mongoose.model('Expense').where({
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
        });
    }).then(function(selectResult) {
        return Q.npost(selectResult, 'exec', [  ])
        ;
    });
};

expenseSchema.statics.findByStatus = function (status) {
    var me = this;
    return Q().then(function() {
        return mongoose.model('Expense').where({ status : status });
    }).then(function(selectResult) {
        return Q.npost(selectResult, 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

expenseSchema.methods.getMoniker = function () {
    return  this.description + " on " +  this.date;
};


/**
 *  Whether this expense qualifies for automatic approval. 
 */
expenseSchema.methods.isAutomaticApproval = function () {
    return  this.amount < 50;
};

expenseSchema.methods.getDaysProcessed = function () {
    if ( this.processed == null) {
        return 0;
    } else  {
        return ( this.processed - new Date()) / (1000*60*60*24);
    }
};
/*************************** PRIVATE OPS ***********************/

expenseSchema.methods.reportApproved = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./Employee.js'), 'findOne', [ ({ _id : me.employee }) ]);
        }),
        Q().then(function() {
            return me.amount;
        }),
        Q.all([
            Q().then(function() {
                return Q.npost(require('./Category.js'), 'findOne', [ ({ _id : me.category }) ]);
            }),
            Q().then(function() {
                return me.description + "(";
            })
        ]).spread(function(category, addResult) {
            return addResult + category.name + ")";
        }),
        Q().then(function() {
            return me.getExpenseId();
        }),
        Q().then(function() {
            return me.expensePayer;
        })
    ]).spread(function(employee, amount, addResult, expenseId, expensePayer) {
        return expensePayer.expenseApproved(employee.name, amount, addResult, expenseId);;
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};
/*************************** STATE MACHINE ********************/
expenseSchema.methods.handleEvent = function (event) {
    var guard;
    switch (event) {
        case 'submit' :
            if (this.status == 'Draft') {
                guard = function() {
                    return  this.isAutomaticApproval();
                }
                ;
                if (guard.call(this)) {
                    this.status = 'Approved';
                    // on entering Approved
                    (function() {
                        var me = this;
                        return Q().then(function() {
                            return Q().then(function() {
                                me['processed'] = new Date();
                            });
                        }).then(function() {
                            return Q().then(function() {
                                return me.reportApproved();
                            });
                        });
                    })();
                    break;
                }
            }
            if (this.status == 'Draft') {
                guard = function() {
                    return !( this.isAutomaticApproval());
                }
                ;
                if (guard.call(this)) {
                    this.status = 'Submitted';
                    break;
                }
            }
            break;
        
        case 'approve' :
            if (this.status == 'Submitted') {
                this.status = 'Approved';
                // on entering Approved
                (function() {
                    var me = this;
                    return Q().then(function() {
                        return Q().then(function() {
                            me['processed'] = new Date();
                        });
                    }).then(function() {
                        return Q().then(function() {
                            return me.reportApproved();
                        });
                    });
                })();
                break;
            }
            break;
        
        case 'review' :
            if (this.status == 'Submitted') {
                this.status = 'Draft';
                break;
            }
            break;
        
        case 'reject' :
            if (this.status == 'Submitted') {
                this.status = 'Rejected';
                // on entering Rejected
                (function() {
                     this['processed'] = new Date();
                })();
                break;
            }
            break;
        
        case 'reconsider' :
            if (this.status == 'Rejected') {
                this.status = 'Submitted';
                break;
            }
            break;
    }
    return Q.npost( this, 'save', [  ]);
};

expenseSchema.methods.submit = function () {
    return this.handleEvent('submit');
};
expenseSchema.methods.approve = function () {
    return this.handleEvent('approve');
};
expenseSchema.methods.review = function () {
    return this.handleEvent('review');
};
expenseSchema.methods.reject = function () {
    return this.handleEvent('reject');
};
expenseSchema.methods.reconsider = function () {
    return this.handleEvent('reconsider');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Expense', expenseSchema);
