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
        "default" : null
    },
    status : {
        type : String,
        enum : ["Draft", "Submitted", "Approved", "Rejected"],
        "default" : "Draft"
    },
    amount : {
        type : Number,
        "default" : 0
    },
    date : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    processed : {
        type : Date,
        "default" : new Date()
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
            console.log("newExpense = new Expense();\n");
            newExpense = new Expense();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newExpense['description'] = description;\n");
            newExpense['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newExpense['amount'] = amount;\n");
            newExpense['amount'] = amount;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newExpense['date'] = date;\n");
            newExpense['date'] = date;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(category);\nconsole.log(\"That: \");\nconsole.log(newExpense);\nnewExpense.category = category._id\n;\n");
            console.log("This: ");
            console.log(category);
            console.log("That: ");
            console.log(newExpense);
            newExpense.category = category._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(employee);\nconsole.log(\"That: \");\nconsole.log(newExpense);\nnewExpense.employee = employee._id;\nconsole.log(\"This: \");\nconsole.log(newExpense);\nconsole.log(\"That: \");\nconsole.log(employee);\nemployee.expenses.push(newExpense._id);\n");
            console.log("This: ");
            console.log(employee);
            console.log("That: ");
            console.log(newExpense);
            newExpense.employee = employee._id;
            console.log("This: ");
            console.log(newExpense);
            console.log("That: ");
            console.log(employee);
            employee.expenses.push(newExpense._id);
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(newExpense, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(newExpense, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
        });
    }).then(function() {
        return me.save();
    });
};

expenseSchema.methods.approve = function () {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(cls.getNamespace('currentUser'));\nconsole.log(\"That: \");\nconsole.log(me);\nme.approver = cls.getNamespace('currentUser')._id\n;\n");
        console.log("This: ");
        console.log(cls.getNamespace('currentUser'));
        console.log("That: ");
        console.log(me);
        me.approver = cls.getNamespace('currentUser')._id
        ;
    }).then(function() {
        return me.save();
    });
};

/**
 *  Reject this expense. Please provide a reason. 
 */
expenseSchema.methods.reject = function (reason) {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("me['rejectionReason'] = reason;\n");
            me['rejectionReason'] = reason;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(cls.getNamespace('currentUser'));\nconsole.log(\"That: \");\nconsole.log(me);\nme.approver = cls.getNamespace('currentUser')._id\n;\n");
            console.log("This: ");
            console.log(cls.getNamespace('currentUser'));
            console.log("That: ");
            console.log(me);
            me.approver = cls.getNamespace('currentUser')._id
            ;
        });
    }).then(function() {
        return me.save();
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
        console.log("return Q.npost(this.model('Expense').find().where({ { 'category' : e  } : category }), 'exec', [  ])\n;\n");
        return Q.npost(this.model('Expense').find().where({ { 'category' : e  } : category }), 'exec', [  ])
        ;
    });
};

expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(this.model('Expense').find().where({\n    $and : [ \n        {\n            $or : [ \n                { start : null },\n                {\n                    $gte : [ \n                        date,\n                        start\n                    ]\n                }\n            ]\n        },\n        {\n            $or : [ \n                { end_ : null },\n                {\n                    $lte : [ \n                        date,\n                        end_\n                    ]\n                }\n            ]\n        }\n    ]\n}), 'exec', [  ])\n;\n");
        return Q.npost(this.model('Expense').find().where({
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
        console.log("return Q.npost(this.model('Expense').find().where({ status : status }), 'exec', [  ])\n;\n");
        return Q.npost(this.model('Expense').find().where({ status : status }), 'exec', [  ])
        ;
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
        Q().then(function() {
            console.log("return Q.npost(Employee, 'findOne', [ ({ _id : me.employee }) ]);");
            return Q.npost(Employee, 'findOne', [ ({ _id : me.employee }) ]);
        }),
        Q().then(function() {
            console.log("return me['amount'];");
            return me['amount'];
        }),
        Q.all([
            Q().then(function() {
                console.log("return Q.npost(Category, 'findOne', [ ({ _id : me.category }) ]);");
                return Q.npost(Category, 'findOne', [ ({ _id : me.category }) ]);
            }),
            Q().then(function() {
                console.log("return me['description'] + \"(\";");
                return me['description'] + "(";
            })
        ]).spread(function(category, add) {
            return add + category['name'] + ")";
        }),
        Q().then(function() {
            console.log("return me['expenseId'];");
            return me['expenseId'];
        }),
        Q().then(function() {
            console.log("return me['expensePayer'];");
            return me['expensePayer'];
        })
    ]).spread(function(employee, amount, add, expenseId, expensePayer) {
        expensePayer.expenseApproved(employee['name'], amount, add, expenseId);
        return Q();
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
                        return Q().then(function() {
                            return Q().then(function() {
                                console.log("me['processed'] = new Date();\n");
                                me['processed'] = new Date();
                            });
                        }).then(function() {
                            return Q().then(function() {
                                console.log("me.reportApproved();\n");
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
                    return Q().then(function() {
                        return Q().then(function() {
                            console.log("me['processed'] = new Date();\n");
                            me['processed'] = new Date();
                        });
                    }).then(function() {
                        return Q().then(function() {
                            console.log("me.reportApproved();\n");
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
