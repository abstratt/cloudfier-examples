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
    return Expense.newExpense(description, amount, date, category, this);
    return this.save();
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
    return this.expensesByStatus("Draft");
};

employeeSchema.methods.getSubmittedExpenses = function () {
    return this.expensesByStatus("Submitted");
};

employeeSchema.methods.getApprovedExpenses = function () {
    return this.expensesByStatus("Approved");
};

employeeSchema.methods.getRejectedExpenses = function () {
    return this.expensesByStatus("Rejected");
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    return reduce.exec();
};

employeeSchema.methods.expensesByStatus = function (status) {
    return this.expenses.where('status').eq(status).exec();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Employee', employeeSchema);
