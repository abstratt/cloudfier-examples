    var EventEmitter = require('events').EventEmitter;
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
        totalRecorded : {
            type : Number
        },
        totalSubmitted : {
            type : Number
        },
        totalApproved : {
            type : Number
        },
        totalRejected : {
            type : Number
        },
        expenses : [{
            type : Schema.Types.ObjectId,
            ref : "Expense"
        }],
        recordedExpenses : [{
            type : Schema.Types.ObjectId,
            ref : "Expense"
        }],
        submittedExpenses : [{
            type : Schema.Types.ObjectId,
            ref : "Expense"
        }],
        approvedExpenses : [{
            type : Schema.Types.ObjectId,
            ref : "Expense"
        }],
        rejectedExpenses : [{
            type : Schema.Types.ObjectId,
            ref : "Expense"
        }]
    });
    var Employee = mongoose.model('Employee', employeeSchema);
    Employee.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    employeeSchema.methods.declareExpense = function (description, amount, date, category) {
        return Expense.newExpense(description, amount, date, category, this);
    };
    /*************************** DERIVED PROPERTIES ****************/
    
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
    
    employeeSchema.methods.getTotalRecorded = function () {
        return this.totalExpenses(this.recordedExpenses);
    };
    
    employeeSchema.methods.getTotalSubmitted = function () {
        return this.totalExpenses(this.submittedExpenses);
    };
    
    employeeSchema.methods.getTotalApproved = function () {
        return this.totalExpenses(this.approvedExpenses);
    };
    
    employeeSchema.methods.getTotalRejected = function () {
        return this.totalExpenses(this.rejectedExpenses);
    };
    /*************************** PRIVATE OPS ***********************/
    
    employeeSchema.methods.totalExpenses = function (toSum) {
        return reduce;
    };
    
    employeeSchema.methods.expensesByStatus = function (status) {
        return Unsupported ReadLinkAction.where('status').eq(status);
    };
    
    var exports = module.exports = Employee;
