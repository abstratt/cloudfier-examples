
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Category = require('../models/Category.js');
var Expense = require('../models/Expense.js');
var Employee = require('../models/Employee.js');


var Tests = {
    declare : function(amount) {
        emp = Employee.find();
        cat = Category.find();
        return emp.declareExpense("just a test expense", amount, new Date(), cat);
    }
};

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(10000);

    test('declaredExpenseRemainsInDraft', function(done) {
        var expense;
        q().then(function () {
            expense = Tests.declare(10.0);
        }).then(function () {
            assert.equal("Draft", expense.status, '"Draft" == expense.status');
        }).then(done, done);
    });
    test('automaticApproval', function(done) {
        q().then(function () {
            assert.strictEqual(Tests.declare(49.9).automaticApproval, true, 'Tests.declare(49.9).automaticApproval === true')
        }).then(function () {
            assert.strictEqual(!Tests.declare(50.0).automaticApproval, true, '!Tests.declare(50.0).automaticApproval === true')
        }).then(done, done);
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        var expense;
        q().then(function () {
            expense = Tests.declare(10.0);
            assert.strictEqual(expense.automaticApproval, true, 'expense.automaticApproval === true');
        }).then(function () {
            expense.submit();
        }).then(function () {
            assert.equal("Approved", expense.status, '"Approved" == expense.status');
        }).then(done, done);
    });
    test('submitExpense50AndOverNeedsApproval', function(done) {
        var expense;
        q().then(function () {
            expense = Tests.declare(100.0);
            assert.strictEqual(!expense.automaticApproval, true, '!expense.automaticApproval === true');
        }).then(function () {
            expense.submit();
        }).then(function () {
            assert.equal("Submitted", expense.status, '"Submitted" == expense.status');
        }).then(done, done);
    });
    test('rejectedExpense', function(done) {
        var expense;
        q().then(function () {
            expense = Tests.declare(100.0);
        }).then(function () {
            expense.submit();
        }).then(function () {
            expense.reject("Non-reimbursable");
        }).then(function () {
            assert.equal("Rejected", expense.status, '"Rejected" == expense.status');
        }).then(done, done);
    });
});

