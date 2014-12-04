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
            /*sync*/console.log("return new Date();");
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
//            expenseSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

expenseSchema.statics.newExpense = function (description, amount, date, category, employee) {
    var newExpense;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("newExpense = new Expense();\n");
            newExpense = new Expense();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(String, 'findOne', [ ({ _id : description._id }) ]);");
            return Q.npost(String, 'findOne', [ ({ _id : description._id }) ]);
        }).then(function(description) {
            console.log("newExpense['description'] = description;\n");
            newExpense['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Double, 'findOne', [ ({ _id : amount._id }) ]);");
            return Q.npost(Double, 'findOne', [ ({ _id : amount._id }) ]);
        }).then(function(amount) {
            console.log("newExpense['amount'] = amount;\n");
            newExpense['amount'] = amount;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);");
            return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);
        }).then(function(date) {
            console.log("newExpense['date'] = date;\n");
            newExpense['date'] = date;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Category, 'findOne', [ ({ _id : category._id }) ]);");
            return Q.npost(Category, 'findOne', [ ({ _id : category._id }) ]);
        }).then(function(category) {
            console.log("newExpense.category = category._id\n;\n");
            newExpense.category = category._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Employee, 'findOne', [ ({ _id : employee._id }) ]);");
            return Q.npost(Employee, 'findOne', [ ({ _id : employee._id }) ]);
        }).then(function(employee) {
            console.log("newExpense.employee = employee._id;\nemployee.expenses.push(newExpense._id);\n");
            newExpense.employee = employee._id;
            employee.expenses.push(newExpense._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return newExpense;\n");
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
            console.log("return Q.npost(Employee, 'findOne', [ ({ _id : me.employee }) ]);");
            return Q.npost(Employee, 'findOne', [ ({ _id : me.employee }) ]);
        }).then(function(employee) {
            console.log("return !(cls.getNamespace('currentUser') == employee);\n");
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
    }).then(function() {
        return Q().then(function() {
            console.log("me.approver = cls.getNamespace('currentUser')._id\n;\n");
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
        /*sync*/console.log("return !(me.isAutomaticApproval());");
        return !(me.isAutomaticApproval());
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: Cannot reject an expense under the auto-approval limit. (on 'expenses::Expense::reject')");
            error.context = 'expenses::Expense::reject';
            error.constraint = '';
            error.description = 'Cannot reject an expense under the auto-approval limit.';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);");
                return Q.npost(Memo, 'findOne', [ ({ _id : reason._id }) ]);
            }).then(function(reason) {
                console.log("me['rejectionReason'] = reason;\n");
                me['rejectionReason'] = reason;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("me.approver = cls.getNamespace('currentUser')._id\n;\n");
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
        console.log("return Q.npost(mongoose.model('Expense').find().where({ /*read-link*/{ 'category' : e  } : category }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Expense').find().where({ /*read-link*/{ 'category' : e  } : category }), 'exec', [  ])
        ;
    });
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Expense').find().where({\n    $and : [ \n        {\n            $or : [ \n                { start : null },\n                {\n                    $gte : [ \n                        date,\n                        start\n                    ]\n                }\n            ]\n        },\n        {\n            $or : [ \n                { end_ : null },\n                {\n                    $lte : [ \n                        date,\n                        end_\n                    ]\n                }\n            ]\n        }\n    ]\n}), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Expense').find().where({
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
        }), 'exec', [  ])
        ;
    });
};

expenseSchema.statics.findByStatus = function (status) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Expense').find().where({ status : status }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Expense').find().where({ status : status }), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

expenseSchema.methods.getMoniker = function () {
    console.log("this.moniker: " + JSON.stringify(this));
    /*sync*/console.log("return  this.description + \" on \" +  this.date;");
    return  this.description + " on " +  this.date;
};


/**
 *  Whether this expense qualifies for automatic approval. 
 */
expenseSchema.methods.isAutomaticApproval = function () {
    console.log("this.automaticApproval: " + JSON.stringify(this));
    /*sync*/console.log("return  this.amount < 50;");
    return  this.amount < 50;
};

expenseSchema.methods.getDaysProcessed = function () {
    console.log("this.daysProcessed: " + JSON.stringify(this));
    /*sync*/console.log("if ( this.processed == null) {\n    return 0;\n} else  {\n    return ( this.processed - new Date()) / (1000*60*60*24);\n}");
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
            console.log("return Q.npost(Employee, 'findOne', [ ({ _id : me.employee }) ]);");
            return Q.npost(Employee, 'findOne', [ ({ _id : me.employee }) ]);
        }),
        Q().then(function() {
            console.log("return me.amount;");
            return me.amount;
        }),
        Q.all([
            Q().then(function() {
                console.log("return Q.npost(Category, 'findOne', [ ({ _id : me.category }) ]);");
                return Q.npost(Category, 'findOne', [ ({ _id : me.category }) ]);
            }),
            Q().then(function() {
                console.log("return me.description + \"(\";");
                return me.description + "(";
            })
        ]).spread(function(category, add) {
            console.log("category:" + category);console.log("add:" + add);
            return add + category.name + ")";
        }),
        Q().then(function() {
            console.log("return me.getExpenseId();");
            return me.getExpenseId();
        }),
        Q().then(function() {
            console.log("return me.expensePayer;");
            return me.expensePayer;
        })
    ]).spread(function(employee, amount, add, expenseId, expensePayer) {
        console.log("employee:" + employee);console.log("amount:" + amount);console.log("add:" + add);console.log("expenseId:" + expenseId);console.log("expensePayer:" + expensePayer);
        return expensePayer.expenseApproved(employee.name, amount, add, expenseId);;
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
    console.log("started handleEvent("+ event+")");
    var guard;
    switch (event) {
        case 'submit' :
            if (this.status == 'Draft') {
                guard = function() {
                    /*sync*/console.log("return  this.isAutomaticApproval();");
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
                                console.log("me['processed'] = new Date();\n");
                                me['processed'] = new Date();
                            });
                        }).then(function() {
                            return Q().then(function() {
                                console.log("return me.reportApproved();");
                                return me.reportApproved();
                            });
                        });
                    })();
                    break;
                }
            }
            if (this.status == 'Draft') {
                guard = function() {
                    /*sync*/console.log("return !( this.isAutomaticApproval());");
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
                            console.log("me['processed'] = new Date();\n");
                            me['processed'] = new Date();
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("return me.reportApproved();");
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
                    /*sync*/console.log(" this['processed'] = new Date();");
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
    console.log("completed handleEvent("+ event+")");
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
