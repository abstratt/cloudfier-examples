var Q = require("q");
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
    var me = this;
    return Q.when(function() {
        console.log("return Expense.newExpense(description, amount, date, category, me);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Expense.newExpense(description, amount, date, category, me);
    }).then(function(call_newExpense) {
        call_newExpense.save();
        return q(call_newExpense);
    });
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.virtual('totalRecorded').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return me.getRecordedExpenses();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getRecordedExpenses();
        }),
        Q.when(function() {
            console.log("return me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me;
        })
    ]).spread(function(read_recordedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_recordedExpenses);
    });
});

employeeSchema.virtual('totalSubmitted').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return me.getSubmittedExpenses();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getSubmittedExpenses();
        }),
        Q.when(function() {
            console.log("return me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me;
        })
    ]).spread(function(read_submittedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_submittedExpenses);
    });
});

employeeSchema.virtual('totalApproved').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return me.getApprovedExpenses();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getApprovedExpenses();
        }),
        Q.when(function() {
            console.log("return me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me;
        })
    ]).spread(function(read_approvedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_approvedExpenses);
    });
});

employeeSchema.virtual('totalRejected').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return me.getRejectedExpenses();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getRejectedExpenses();
        }),
        Q.when(function() {
            console.log("return me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me;
        })
    ]).spread(function(read_rejectedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(read_rejectedExpenses);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.methods.getRecordedExpenses = function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.expensesByStatus(<Q>Draft<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.expensesByStatus("Draft");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};

employeeSchema.methods.getSubmittedExpenses = function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.expensesByStatus(<Q>Submitted<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.expensesByStatus("Submitted");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};

employeeSchema.methods.getApprovedExpenses = function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.expensesByStatus(<Q>Approved<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.expensesByStatus("Approved");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};

employeeSchema.methods.getRejectedExpenses = function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.expensesByStatus(<Q>Rejected<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.expensesByStatus("Rejected");
    }).then(function(call_expensesByStatus) {
        return call_expensesByStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    return /*TBD*/reduce.exec();
};

employeeSchema.methods.expensesByStatus = function (status) {
    var me = this;
    return Q.when(function() {
        console.log("return Expense.find({ employee : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Expense.find({ employee : me._id }).exec();
    }).then(function(readLinkAction) {
        return readLinkAction.where({ status : status }).exec();
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Employee', employeeSchema);
