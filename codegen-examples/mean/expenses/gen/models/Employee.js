var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Category = require('./Category.js');
var Expense = require('./Expense.js');

/**
 *  An employee reports expenses. 
 */
// declare schema
var employeeSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    username : {
        type : String,
        "default" : null
    },
    expenses : [{
        type : Schema.Types.ObjectId,
        ref : "Expense",
        "default" : []
    }]
});
//            employeeSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

employeeSchema.methods.declareExpense = function (description, amount, date, category) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("return Expense.newExpense(description, amount, date, category, me);");
        return Expense.newExpense(description, amount, date, category, me);
    }).then(function(newExpense) {
        console.log("return newExpense;\n");
        return newExpense;
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    })
    ;
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.virtual('totalRecorded').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return me.getRecordedExpenses();");
            return me.getRecordedExpenses();
        }),
        Q().then(function() {
            console.log("return me;");
            return me;
        })
    ]).spread(function(recordedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(recordedExpenses);
    });
});

employeeSchema.virtual('totalSubmitted').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return me.getSubmittedExpenses();");
            return me.getSubmittedExpenses();
        }),
        Q().then(function() {
            console.log("return me;");
            return me;
        })
    ]).spread(function(submittedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(submittedExpenses);
    });
});

employeeSchema.virtual('totalApproved').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return me.getApprovedExpenses();");
            return me.getApprovedExpenses();
        }),
        Q().then(function() {
            console.log("return me;");
            return me;
        })
    ]).spread(function(approvedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(approvedExpenses);
    });
});

employeeSchema.virtual('totalRejected').get(function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            console.log("return me.getRejectedExpenses();");
            return me.getRejectedExpenses();
        }),
        Q().then(function() {
            console.log("return me;");
            return me;
        })
    ]).spread(function(rejectedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(rejectedExpenses);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.methods.getRecordedExpenses = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.expensesByStatus(\"Draft\");");
        return me.expensesByStatus("Draft");
    }).then(function(expensesByStatus) {
        console.log("return expensesByStatus;\n");
        return expensesByStatus;
    });
};

employeeSchema.methods.getSubmittedExpenses = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.expensesByStatus(\"Submitted\");");
        return me.expensesByStatus("Submitted");
    }).then(function(expensesByStatus) {
        console.log("return expensesByStatus;\n");
        return expensesByStatus;
    });
};

employeeSchema.methods.getApprovedExpenses = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.expensesByStatus(\"Approved\");");
        return me.expensesByStatus("Approved");
    }).then(function(expensesByStatus) {
        console.log("return expensesByStatus;\n");
        return expensesByStatus;
    });
};

employeeSchema.methods.getRejectedExpenses = function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.expensesByStatus(\"Rejected\");");
        return me.expensesByStatus("Rejected");
    }).then(function(expensesByStatus) {
        console.log("return expensesByStatus;\n");
        return expensesByStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    return Q.npost(/*TBD*/reduce, 'exec', [  ])
    ;
};

employeeSchema.methods.expensesByStatus = function (status) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Expense, 'find', [ ({ employee : me._id }) ]);");
        return Q.npost(Expense, 'find', [ ({ employee : me._id }) ]);
    }).then(function(readLinkAction) {
        console.log("return Q.npost(readLinkAction.where({ status : status }), 'exec', [  ])\n;\n");
        return Q.npost(readLinkAction.where({ status : status }), 'exec', [  ])
        ;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Employee', employeeSchema);
