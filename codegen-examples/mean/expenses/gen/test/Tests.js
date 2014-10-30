
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Category = require('../models/Category.js');
var Expense = require('../models/Expense.js');
var Employee = require('../models/Employee.js');


var Tests = {
    declare : function(amount) {
        console.log("emp = this.model('Employee').find()");
        emp = this.model('Employee').find();
        
        console.log("cat = this.model('Category').find()");
        cat = this.model('Category').find();
        
        console.log("return emp.declareExpense('just a test expense', amount, new Date(), cat)");
        return emp.declareExpense("just a test expense", amount, new Date(), cat);
    }
};

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(10000);

    test('declaredExpenseRemainsInDraft', function(done) {
        var expense;
        return q().then(function () {
            console.log("expense = Tests.declare(10.0)");
            expense = Tests.declare(10.0);
        }).then(function () {
            console.log("assert.equal('Draft', expense.status, ''Draft' == expense.status')");
            assert.equal("Draft", expense.status, '"Draft" == expense.status');
        });
    });
    test('automaticApproval', function(done) {
        return q().then(function () {
            assert.strictEqual(Tests.declare(49.9).automaticApproval, true, 'Tests.declare(49.9).automaticApproval === true')
        }).then(function () {
            assert.strictEqual(!Tests.declare(50.0).automaticApproval, true, '!Tests.declare(50.0).automaticApproval === true')
        });
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        var expense;
        return q().then(function () {
            console.log("expense = Tests.declare(10.0)");
            expense = Tests.declare(10.0);
            
            console.log("assert.strictEqual(expense.automaticApproval, true, 'expense.automaticApproval === true')");
            assert.strictEqual(expense.automaticApproval, true, 'expense.automaticApproval === true');
        }).then(function () {
            console.log("expense.submit()");
            expense.submit();
        }).then(function () {
            console.log("assert.equal('Approved', expense.status, ''Approved' == expense.status')");
            assert.equal("Approved", expense.status, '"Approved" == expense.status');
        });
    });
    test('submitExpense50AndOverNeedsApproval', function(done) {
        var expense;
        return q().then(function () {
            console.log("expense = Tests.declare(100.0)");
            expense = Tests.declare(100.0);
            
            console.log("assert.strictEqual(!expense.automaticApproval, true, '!expense.automaticApproval === true')");
            assert.strictEqual(!expense.automaticApproval, true, '!expense.automaticApproval === true');
        }).then(function () {
            console.log("expense.submit()");
            expense.submit();
        }).then(function () {
            console.log("assert.equal('Submitted', expense.status, ''Submitted' == expense.status')");
            assert.equal("Submitted", expense.status, '"Submitted" == expense.status');
        });
    });
    test('rejectedExpense', function(done) {
        var expense;
        return q().then(function () {
            console.log("expense = Tests.declare(100.0)");
            expense = Tests.declare(100.0);
        }).then(function () {
            console.log("expense.submit()");
            expense.submit();
        }).then(function () {
            console.log("expense.reject('Non-reimbursable')");
            expense.reject("Non-reimbursable");
        }).then(function () {
            console.log("assert.equal('Rejected', expense.status, ''Rejected' == expense.status')");
            assert.equal("Rejected", expense.status, '"Rejected" == expense.status');
        });
    });
});

