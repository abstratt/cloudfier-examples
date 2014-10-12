    var EventEmitter = require('events').EventEmitter;        

    /**
     *  An employee reports expenses. 
     */
    var employeeSchema = new Schema({
        name : String,
        username : String,
        totalRecorded : Number,
        totalSubmitted : Number,
        totalApproved : Number,
        totalRejected : Number
    });
    
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
    
    var Employee = mongoose.model('Employee', employeeSchema);
    Employee.emitter = new EventEmitter();
