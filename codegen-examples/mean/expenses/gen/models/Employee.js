var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  An employee reports expenses. 
 */
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
var Employee = mongoose.model('Employee', employeeSchema);

/*************************** ACTIONS ***************************/

employeeSchema.methods.declareExpense = function (description, amount, date, category) {
    return Expense.newExpense(description, amount, date, category, this);
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.virtual('totalRecorded').get(function () {
    return this.totalExpenses(this.recordedExpenses);
});

employeeSchema.virtual('totalSubmitted').get(function () {
    return this.totalExpenses(this.submittedExpenses);
});

employeeSchema.virtual('totalApproved').get(function () {
    return this.totalExpenses(this.approvedExpenses);
});

employeeSchema.virtual('totalRejected').get(function () {
    return this.totalExpenses(this.rejectedExpenses);
});
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.method.getRecordedExpenses = function () {
    return this.expensesByStatus(null);
};

employeeSchema.method.getSubmittedExpenses = function () {
    return this.expensesByStatus(null);
};

employeeSchema.method.getApprovedExpenses = function () {
    return this.expensesByStatus(null);
};

employeeSchema.method.getRejectedExpenses = function () {
    return this.expensesByStatus(null);
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    return reduce;
};

employeeSchema.methods.expensesByStatus = function (status) {
    return this.expenses.where('status').eq(status);
};

var exports = module.exports = Employee;
