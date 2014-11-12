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
    }).then(function(newExpense) {
        return newExpense.save();
    });
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.virtual('totalRecorded').get(function () {
    return q().then(function() {
        return this.getRecordedExpenses();
    }).then(function(recordedExpenses) {
        return this.totalExpenses(recordedExpenses);
    });
});

employeeSchema.virtual('totalSubmitted').get(function () {
    return q().then(function() {
        return this.getSubmittedExpenses();
    }).then(function(submittedExpenses) {
        return this.totalExpenses(submittedExpenses);
    });
});

employeeSchema.virtual('totalApproved').get(function () {
    return q().then(function() {
        return this.getApprovedExpenses();
    }).then(function(approvedExpenses) {
        return this.totalExpenses(approvedExpenses);
    });
});

employeeSchema.virtual('totalRejected').get(function () {
    return q().then(function() {
        return this.getRejectedExpenses();
    }).then(function(rejectedExpenses) {
        return this.totalExpenses(rejectedExpenses);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.methods.getRecordedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Draft");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};

employeeSchema.methods.getSubmittedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Submitted");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};

employeeSchema.methods.getApprovedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Approved");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};

employeeSchema.methods.getRejectedExpenses = function () {
    return q().then(function() {
        return this.expensesByStatus("Rejected");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    return reduce.exec();
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
