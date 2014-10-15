    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    /**
     *  The expense as reported by an employee. 
     */
    var expenseSchema = new Schema({
        moniker : {
            type : String
        },
        description : {
            type : String
        },
        status : {
            type : String,
            enum : ["Draft", "Submitted", "Approved", "Rejected"]
        },
        amount : {
            type : Number
        },
        date : {
            type : Date
        },
        processed : {
            type : Date
        },
        rejectionReason : {
            type : String
        },
        expenseId : {
            type : Number
        },
        automaticApproval : {
            type : Boolean
        },
        daysProcessed : {
            type : Number
        },
        category : {
            type : Schema.Types.ObjectId,
            ref : "Category"
        },
        employee : {
            type : Schema.Types.ObjectId,
            ref : "Employee"
        },
        approver : {
            type : Schema.Types.ObjectId,
            ref : "Employee"
        }
    });
    var Expense = mongoose.model('Expense', expenseSchema);
    Expense.emitter = new EventEmitter();
    
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
        this.approver = cls.getNamespace('currentUser');
    };
    
    /**
     *  Reject this expense. Please provide a reason. 
     */
    expenseSchema.methods.reject = function (reason) {
        this.rejectionReason = reason;
        this.approver = cls.getNamespace('currentUser');
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
    expenseSchema.methods.isAutomaticApproval = function () {
        return this.amount < 50;
    };
    
    expenseSchema.methods.getDaysProcessed = function () {
        if (this.processed == null) {
            return 0;
        } else  {
            return ;
        }
    };
    /*************************** PRIVATE OPS ***********************/
    
    expenseSchema.methods.reportApproved = function () {
        this.expensePayer.expenseApproved(this.employee.name, this.amount, this.description + "(" + this.category.name + ")", this.expenseId);
    };
    /*************************** STATE MACHINE ********************/
    Expense.emitter.on('submit', function () {
        var guard;
        if (this.status == 'Draft') {
            guard = function() {
                return this.automaticApproval;
            };
            if (guard()) {
                this.status = 'Approved';
                (function() {
                    this.processed = new Date();
                    this.reportApproved();
                })();
                return;
            }
        }
        if (this.status == 'Draft') {
            guard = function() {
                return !(this.automaticApproval);
            };
            if (guard()) {
                this.status = 'Submitted';
                return;
            }
        }
    });     
    
    Expense.emitter.on('approve', function () {
        if (this.status == 'Submitted') {
            this.status = 'Approved';
            (function() {
                this.processed = new Date();
                this.reportApproved();
            })();
            return;
        }
    });     
    
    Expense.emitter.on('review', function () {
        if (this.status == 'Submitted') {
            this.status = 'Draft';
            return;
        }
    });     
    
    Expense.emitter.on('reject', function () {
        if (this.status == 'Submitted') {
            this.status = 'Rejected';
            (function() {
                this.processed = new Date();
            })();
            return;
        }
    });     
    
    Expense.emitter.on('reconsider', function () {
        if (this.status == 'Rejected') {
            this.status = 'Submitted';
            return;
        }
    });     
    
    
    var exports = module.exports = Expense;
