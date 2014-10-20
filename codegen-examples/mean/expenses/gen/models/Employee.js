var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  An employee reports expenses. 
 */
// declare schema
var employeeSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String
    },
    expenses : [{
        type : Schema.Types.ObjectId,
        ref : "Expense"
    }]
});

/*************************** ACTIONS ***************************/

employeeSchema.methods.declareExpense = function (description, amount, date, category) {
    return require('./Expense.js').newExpense(description, amount, date, category, this);
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.virtual('totalRecorded').get(function () {
    return this.totalExpenses(this.getRecordedExpenses());
});

employeeSchema.virtual('totalSubmitted').get(function () {
    return this.totalExpenses(this.getSubmittedExpenses());
});

employeeSchema.virtual('totalApproved').get(function () {
    return this.totalExpenses(this.getApprovedExpenses());
});

employeeSchema.virtual('totalRejected').get(function () {
    return this.totalExpenses(this.getRejectedExpenses());
});
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.methods.getRecordedExpenses = function () {
    return this.expensesByStatus(null);
};

employeeSchema.methods.getSubmittedExpenses = function () {
    return this.expensesByStatus(null);
};

employeeSchema.methods.getApprovedExpenses = function () {
    return this.expensesByStatus(null);
};

employeeSchema.methods.getRejectedExpenses = function () {
    return this.expensesByStatus(null);
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    return reduce;
};

employeeSchema.methods.expensesByStatus = function (status) {
    return this.expenses.where('status').eq(status);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Employee', employeeSchema);
