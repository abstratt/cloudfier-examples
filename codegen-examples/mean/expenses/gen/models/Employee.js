var q = require("q");
var mongoose = require('mongoose');    
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
        required : true,
        default : null
    },
    username : {
        type : String,
        default : null
    },
    expenses : [{
        type : Schema.Types.ObjectId,
        ref : "Expense"
    }]
});

/*************************** ACTIONS ***************************/

employeeSchema.methods.declareExpense = function (description, amount, date, category) {
    return q().then(function() {
        return Expense.newExpense(description, amount, date, category, this);
    }).then(function(call_newExpense) {
        call_newExpense.save();
        return q(call_newExpense);
    });
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.virtual('totalRecorded').get(function () {
    return q().all([
        q().then(function() {
            return this.getRecordedExpenses();
        }), q().then(function() {
            return this;
        })
    ]).spread(function(read_recordedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_recordedExpenses);
    });
});

employeeSchema.virtual('totalSubmitted').get(function () {
    return q().all([
        q().then(function() {
            return this.getSubmittedExpenses();
        }), q().then(function() {
            return this;
        })
    ]).spread(function(read_submittedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_submittedExpenses);
    });
});

employeeSchema.virtual('totalApproved').get(function () {
    return q().all([
        q().then(function() {
            return this.getApprovedExpenses();
        }), q().then(function() {
            return this;
        })
    ]).spread(function(read_approvedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_approvedExpenses);
    });
});

employeeSchema.virtual('totalRejected').get(function () {
    return q().all([
        q().then(function() {
            return this.getRejectedExpenses();
        }), q().then(function() {
            return this;
        })
    ]).spread(function(read_rejectedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_rejectedExpenses);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.methods.getRecordedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Draft");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};

employeeSchema.methods.getSubmittedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Submitted");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};

employeeSchema.methods.getApprovedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Approved");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};

employeeSchema.methods.getRejectedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Rejected");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    return /*TBD*/reduce.exec();
};

employeeSchema.methods.expensesByStatus = function (status) {
    return q().then(function() {
        return Expense.findOne({ _id : this.expenses }).exec();
    }).then(function(readLinkAction) {
        return readLinkAction.where({ status : status }).exec();
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Employee', employeeSchema);
