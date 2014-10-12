    var EventEmitter = require('events').EventEmitter;        

    /**
     *  The expense as reported by an employee. 
     */
    var expenseSchema = new Schema({
        moniker : String,
        description : String,
        status : Status,
        amount : Number,
        date : Date,
        processed : Date,
        rejectionReason : String,
        expenseId : Number,
        automaticApproval : Boolean,
        daysProcessed : Number
    });
    
    /*************************** ACTIONS ***************************/
    
    expenseSchema.statics.newExpense = function (description, amount, date, category, employee) {
        newExpense = new Expense();
        newExpense.description = description;
        newExpense.amount = amount;
        newExpense.date = date;
        newExpense.category = category;
        newExpense.employee = employee;
        return newExpense;
    };
    
    expenseSchema.methods.approve = function () {
        this.approver = System.user();
    };
    
    /**
     *  Reject this expense. Please provide a reason. 
     */
    expenseSchema.methods.reject = function (reason) {
        this.rejectionReason = reason;
        this.approver = System.user();
    };
    
    /**
     *  Reconsider this expense. 
     */
    expenseSchema.methods.reconsider = function () {};
    
    /**
     *  Sends this expense back to Draft state. 
     */
    expenseSchema.methods.review = function () {};
    
    /**
     *  Submit this expense. 
     */
    expenseSchema.methods.submit = function () {};
    
    /*************************** QUERIES ***************************/
    
    expenseSchema.statics.findExpensesByCategory = function (category) {
        return this.model('Expense').find().where('category').eq(category).exec();
    };
    
    expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
        return this.model('Expense').find()start.eq(null).or(.where('date').gte(start)).and(end_.eq(null).or(.where('date').lte(end_))).exec();
    };
    
    expenseSchema.statics.findByStatus = function (status) {
        return this.model('Expense').find().where('status').eq(status).exec();
    };
    
    /*************************** DERIVED PROPERTIES ****************/
    
    expenseSchema.methods.getMoniker = function () {
        return this.description + " on " + this.date;
    };
    
    
    /**
     *  Whether this expense qualifies for automatic approval. 
     */
    expenseSchema.methods.getAutomaticApproval = function () {
        return this.amount.lowerThan(UNKNOWN: 50);
    };
    
    expenseSchema.methods.getDaysProcessed = function () {
        if (this.processed == null) {
            return UNKNOWN: 0;
        } else  {
            return ;
        }
    };
    
    /*************************** PRIVATE OPS ***********************/
    
    expenseSchema.methods.reportApproved = function () {
        this.expensePayer.expenseApproved(this.employee.name, this.amount, this.description + "(" + this.category.name + ")", this.expenseId);
    };
    
    var Expense = mongoose.model('Expense', expenseSchema);
    Expense.emitter = new EventEmitter();
