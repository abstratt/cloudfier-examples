
var mongoose = require('mongoose');
var assert = require("assert");
var Q = require("q");
var Category = require('../models/Category.js');
var Expense = require('../models/Expense.js');
var Employee = require('../models/Employee.js');


var Tests = {
    declare : function(amount) {
        var emp;
        var cat;
        var expense;
        var me = this;
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("emp = this.model('Employee').find();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                emp = this.model('Employee').find();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("cat = this.model('Category').find();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                cat = this.model('Category').find();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("return emp.declareExpense(<Q>just a test expense<Q>, amount, new Date(), cat);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return emp.declareExpense("just a test expense", amount, new Date(), cat);
            }).then(function(call_declareExpense) {
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
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(function() {
                    console.log("return Tests.declare(10.0);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Tests.declare(10.0);
                }).then(function(call_declare) {
                    expense = call_declare;
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.equal(<Q>Draft<Q>, expense['status']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.equal("Draft", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('automaticApproval', function(done) {
        var behavior = function() {
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(function() {
                    console.log("return Tests.declare(49.9);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Tests.declare(49.9);
                }).then(function(call_declare) {
                    assert.strictEqual(call_declare['automaticApproval'], true);
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("return Tests.declare(50.0);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Tests.declare(50.0);
                }).then(function(call_declare) {
                    assert.strictEqual(!call_declare['automaticApproval'], true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        var behavior = function() {
            var expense;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Tests.declare(10.0);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Tests.declare(10.0);
                    }).then(function(call_declare) {
                        expense = call_declare;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("assert.strictEqual(expense['automaticApproval'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(expense['automaticApproval'], true);
                    });
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("return expense.submit();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return expense.submit();
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.equal(<Q>Approved<Q>, expense['status']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.equal("Approved", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('submitExpense50AndOverNeedsApproval', function(done) {
        var behavior = function() {
            var expense;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(null).then(function() {
                    return Q.when(function() {
                        console.log("return Tests.declare(100.0);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        return Tests.declare(100.0);
                    }).then(function(call_declare) {
                        expense = call_declare;
                    });
                }).then(function() {
                    return Q.when(function() {
                        console.log("assert.strictEqual(!expense['automaticApproval'], true);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                        assert.strictEqual(!expense['automaticApproval'], true);
                    });
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("return expense.submit();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return expense.submit();
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.equal(<Q>Submitted<Q>, expense['status']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.equal("Submitted", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('rejectedExpense', function(done) {
        var behavior = function() {
            var expense;
            var me = this;
            return Q.when(null).then(function() {
                return Q.when(function() {
                    console.log("return Tests.declare(100.0);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return Tests.declare(100.0);
                }).then(function(call_declare) {
                    expense = call_declare;
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("return expense.submit();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    return expense.submit();
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("expense.reject(<Q>Non-reimbursable<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    expense.reject("Non-reimbursable");
                });
            }).then(function() {
                return Q.when(function() {
                    console.log("assert.equal(<Q>Rejected<Q>, expense['status']);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                    assert.equal("Rejected", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
});

