
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Category = require('../models/Category.js');
var Expense = require('../models/Expense.js');
var Employee = require('../models/Employee.js');


var Tests = {
    declare : function(amount) {
        return q().then(function() {
            return emp.declareExpense("just a test expense", amount, new Date(), cat);
        }).then(function(declareExpense) {
            emp = this.model('Employee').find();
            cat = this.model('Category').find();
            return declareExpense.save();
        });
    }
};

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(10000);

    test('declaredExpenseRemainsInDraft', function(done) {
        return q().then(function() {
            return Tests.declare(10.0);
        }).then(function(declare) {
            expense = declare;
            assert.equal("Draft", expense['status']);
        });
    });
    test('automaticApproval', function(done) {
        return q().all([q().then(function() {
            return Tests.declare(49.9);
        }), q().then(function() {
            return Tests.declare(50.0);
        })]).spread(function(declare, declare) {
            assert.strictEqual(declare['automaticApproval'], true);
            assert.strictEqual(!declare['automaticApproval'], true);
        });
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        return q().then(function() {
            return Tests.declare(10.0);
        }).then(function(declare) {
            expense = declare;
            assert.strictEqual(expense['automaticApproval'], true);
            expense.submit();
            assert.equal("Approved", expense['status']);
        });
    });
    test('submitExpense50AndOverNeedsApproval', function(done) {
        return q().then(function() {
            return Tests.declare(100.0);
        }).then(function(declare) {
            expense = declare;
            assert.strictEqual(!expense['automaticApproval'], true);
            expense.submit();
            assert.equal("Submitted", expense['status']);
        });
    });
    test('rejectedExpense', function(done) {
        return q().all([q().then(function() {
            return Tests.declare(100.0);
        }), q().then(function() {
            expense.reject("Non-reimbursable")
        })]).spread(function(declare, reject) {
            expense = declare;
            expense.submit();
            reject;
            assert.equal("Rejected", expense['status']);
        });
    });
});

