
var mongoose = require('mongoose');

var assert = require("assert");


var Tests = {
    declare : function(amount) {
        var emp = exists;
        var cat = exists;
        return emp.declareExpense("just a test expense", amount, new Date(), cat);
    }
};

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(10000);

    test('declaredExpenseRemainsInDraft', function(done) {
        var expense = Tests.declare(10.0);
        assert.equal("Draft", expense.status);
        done();
    });
    test('automaticApproval', function(done) {
        assert.strictEqual(Tests.declare(49.9).automaticApproval, true);
        assert.strictEqual(!Tests.declare(50.0).automaticApproval, true);
        done();
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        var expense = Tests.declare(10.0);
        assert.strictEqual(expense.automaticApproval, true);
        expense.submit();
        assert.equal("Approved", expense.status);
        done();
    });
    test('submitExpense50AndOverNeedsApproval', function(done) {
        var expense = Tests.declare(100.0);
        assert.strictEqual(!expense.automaticApproval, true);
        expense.submit();
        assert.equal("Submitted", expense.status);
        done();
    });
    test('rejectedExpense', function(done) {
        var expense = Tests.declare(100.0);
        expense.submit();
        expense.reject("Non-reimbursable");
        assert.equal("Rejected", expense.status);
        done();
    });
});

