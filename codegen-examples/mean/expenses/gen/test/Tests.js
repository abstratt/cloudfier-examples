
var mongoose = require('mongoose');
var assert = require("assert");
var q = require("q");
var Category = require('../models/Category.js');
var Expense = require('../models/Expense.js');
var Employee = require('../models/Employee.js');


var Tests = {
    declare : function(amount) {
        var emp;
        var cat;
        var expense;
        return q(/*sequential*/).then(function() {
            return q(/*leaf*/).then(function() {
                emp = this.model('Employee').find();
            });
        }).then(function() {
            return q(/*leaf*/).then(function() {
                cat = this.model('Category').find();
            });
        }).then(function() {
            return q(/*leaf*/).then(function() {
                return emp.declareExpense("just a test expense", amount, new Date(), cat);
            }).then(function(/*singleChild*/call_declareExpense) {
                call_declareExpense.save();
                return q(call_declareExpense);
            });
        });
    }
};

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(10000);

    test('declaredExpenseRemainsInDraft', function(done) {
        var behavior = function() {
            var expense;
            return q(/*sequential*/).then(function() {
                return q(/*leaf*/).then(function() {
                    return Tests.declare(10.0);
                }).then(function(/*singleChild*/call_declare) {
                    expense = call_declare;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.equal("Draft", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('automaticApproval', function(done) {
        var behavior = function() {
            return q(/*sequential*/).then(function() {
                return q(/*leaf*/).then(function() {
                    return Tests.declare(49.9);
                }).then(function(/*singleChild*/call_declare) {
                    assert.strictEqual(call_declare['automaticApproval'], true);
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return Tests.declare(50.0);
                }).then(function(/*singleChild*/call_declare) {
                    assert.strictEqual(!call_declare['automaticApproval'], true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        var behavior = function() {
            var expense;
            return q(/*sequential*/).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Tests.declare(10.0);
                    }).then(function(/*singleChild*/call_declare) {
                        expense = call_declare;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        assert.strictEqual(expense['automaticApproval'], true);
                    });
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return expense.submit();
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.equal("Approved", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('submitExpense50AndOverNeedsApproval', function(done) {
        var behavior = function() {
            var expense;
            return q(/*sequential*/).then(function() {
                return q(/*sequential*/).then(function() {
                    return q(/*leaf*/).then(function() {
                        return Tests.declare(100.0);
                    }).then(function(/*singleChild*/call_declare) {
                        expense = call_declare;
                    });
                }).then(function() {
                    return q(/*leaf*/).then(function() {
                        assert.strictEqual(!expense['automaticApproval'], true);
                    });
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return expense.submit();
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.equal("Submitted", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('rejectedExpense', function(done) {
        var behavior = function() {
            var expense;
            return q(/*sequential*/).then(function() {
                return q(/*leaf*/).then(function() {
                    return Tests.declare(100.0);
                }).then(function(/*singleChild*/call_declare) {
                    expense = call_declare;
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    return expense.submit();
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    expense.reject("Non-reimbursable");
                });
            }).then(function() {
                return q(/*leaf*/).then(function() {
                    assert.equal("Rejected", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
});

