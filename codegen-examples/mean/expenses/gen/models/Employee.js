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
    // isAsynchronous: true        
    console.log("return Expense.newExpense(description, amount, date, category, this)");
    return Expense.newExpense(description, amount, date, category, this);
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.virtual('totalRecorded').get(function () {
    // isAsynchronous: false        
    console.log("return this.totalExpenses(this.getRecordedExpenses())");
    return this.totalExpenses(this.getRecordedExpenses());
});

employeeSchema.virtual('totalSubmitted').get(function () {
    // isAsynchronous: false        
    console.log("return this.totalExpenses(this.getSubmittedExpenses())");
    return this.totalExpenses(this.getSubmittedExpenses());
});

employeeSchema.virtual('totalApproved').get(function () {
    // isAsynchronous: false        
    console.log("return this.totalExpenses(this.getApprovedExpenses())");
    return this.totalExpenses(this.getApprovedExpenses());
});

employeeSchema.virtual('totalRejected').get(function () {
    // isAsynchronous: false        
    console.log("return this.totalExpenses(this.getRejectedExpenses())");
    return this.totalExpenses(this.getRejectedExpenses());
});
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.methods.getRecordedExpenses = function () {
    // isAsynchronous: false        
    console.log("return this.expensesByStatus('Draft')");
    return this.expensesByStatus("Draft");
};

employeeSchema.methods.getSubmittedExpenses = function () {
    // isAsynchronous: false        
    console.log("return this.expensesByStatus('Submitted')");
    return this.expensesByStatus("Submitted");
};

employeeSchema.methods.getApprovedExpenses = function () {
    // isAsynchronous: false        
    console.log("return this.expensesByStatus('Approved')");
    return this.expensesByStatus("Approved");
};

employeeSchema.methods.getRejectedExpenses = function () {
    // isAsynchronous: false        
    console.log("return this.expensesByStatus('Rejected')");
    return this.expensesByStatus("Rejected");
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    // isAsynchronous: false        
    console.log("return reduce.exec()");
    return reduce.exec();
};

employeeSchema.methods.expensesByStatus = function (status) {
    // isAsynchronous: false        
    console.log("return this.expenses.where({ status : status }).exec()");
    return this.expenses.where({ status : status }).exec();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Employee', employeeSchema);
