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
        this.handleEvent('newExpense');
    };
    
    expenseSchema.methods.approve = function () {
        this.approver = cls.getNamespace('currentUser');
        this.handleEvent('approve');
    };
    
    /**
     *  Reject this expense. Please provide a reason. 
     */
    expenseSchema.methods.reject = function (reason) {
        this.rejectionReason = reason;
        this.approver = cls.getNamespace('currentUser');
        this.handleEvent('reject');
    };
    
    /**
     *  Reconsider this expense. 
     */
    expenseSchema.methods.reconsider = function () {
        this.handleEvent('reconsider');    
    };
    
    /**
     *  Sends this expense back to Draft state. 
     */
    expenseSchema.methods.review = function () {
        this.handleEvent('review');    
    };
    
    /**
     *  Submit this expense. 
     */
    expenseSchema.methods.submit = function () {
        this.handleEvent('submit');    
    };
    /*************************** QUERIES ***************************/
    
    expenseSchema.statics.findExpensesByCategory = function (category) {
        return this.model('Expense').find().where('category').eq(category).exec();
        this.handleEvent('findExpensesByCategory');
    };
    
    expenseSchema.statics.findExpensesInPeriod = function (start, end_) {
        return this.model('Expense').find()start.eq(null).or(.where('date').gte(start)).and(end_.eq(null).or(.where('date').lte(end_))).exec();
        this.handleEvent('findExpensesInPeriod');
    };
    
    expenseSchema.statics.findByStatus = function (status) {
        return this.model('Expense').find().where('status').eq(status).exec();
        this.handleEvent('findByStatus');
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
        this.handleEvent('reportApproved');
    };
    /*************************** STATE MACHINE ********************/
    expenseSchema.methods.handleEvent = function (event) {
        var guard;
        switch (event) {
            case 'submit' :
                if (this.status == 'Draft') {
                    guard = function() {
                        return this.automaticApproval;
                    };
                    if (guard()) {
                        this.status = 'Approved';
                        // on entering Approved
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
                break;
            
            case 'approve' :
                if (this.status == 'Submitted') {
                    this.status = 'Approved';
                    // on entering Approved
                    (function() {
                        this.processed = new Date();
                        this.reportApproved();
                    })();
                    return;
                }
                break;
            
            case 'review' :
                if (this.status == 'Submitted') {
                    this.status = 'Draft';
                    return;
                }
                break;
            
            case 'reject' :
                if (this.status == 'Submitted') {
                    this.status = 'Rejected';
                    // on entering Rejected
                    (function() {
                        this.processed = new Date();
                    })();
                    return;
                }
                break;
            
            case 'reconsider' :
                if (this.status == 'Rejected') {
                    this.status = 'Submitted';
                    return;
                }
                break;
        }
    };
    
    
    var exports = module.exports = Expense;
