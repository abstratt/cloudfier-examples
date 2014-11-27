
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Category = require('../models/Category.js');
var Expense = require('../models/Expense.js');
var Employee = require('../models/Employee.js');


var Tests = {
    declare : function(amount) {
        var emp;
        var cat;
        var expense;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                console.log("emp = this.model('Employee').find();\n");
                emp = this.model('Employee').find();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("cat = this.model('Category').find();\n");
                cat = this.model('Category').find();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return emp.declareExpense(\"just a test expense\", amount, new Date(), cat);");
                return emp.declareExpense("just a test expense", amount, new Date(), cat);
            }).then(function(declareExpense) {
                console.log(declareExpense);
                console.log("return Q.npost(declareExpense, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
                return Q.npost(declareExpense, 'save', [  ]).then(function(saveResult) {
                    return saveResult[0];
                });
            });
        });
    }
};

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(1000);

    test('declaredExpenseRemainsInDraft', function(done) {
        var behavior = function() {
            var expense;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    console.log("return Tests.declare(10.0);");
                    return Tests.declare(10.0);
                }).then(function(declare) {
                    console.log(declare);
                    console.log("expense = declare;\n");
                    expense = declare;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(\"Draft\", expense['status']);\n");
                    assert.equal("Draft", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
    test('automaticApproval', function(done) {
        var behavior = function() {
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    console.log("return Tests.declare(49.9);");
                    return Tests.declare(49.9);
                }).then(function(declare) {
                    console.log(declare);
                    console.log("assert.strictEqual(declare['automaticApproval'], true);\n");
                    assert.strictEqual(declare['automaticApproval'], true);
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Tests.declare(50.0);");
                    return Tests.declare(50.0);
                }).then(function(declare) {
                    console.log(declare);
                    console.log("assert.strictEqual(!declare['automaticApproval'], true);\n");
                    assert.strictEqual(!declare['automaticApproval'], true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        var behavior = function() {
            var expense;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Tests.declare(10.0);");
                        return Tests.declare(10.0);
                    }).then(function(declare) {
                        console.log(declare);
                        console.log("expense = declare;\n");
                        expense = declare;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(expense['automaticApproval'], true);\n");
                        assert.strictEqual(expense['automaticApproval'], true);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return expense.submit();");
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(\"Approved\", expense['status']);\n");
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
            return Q().then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        console.log("return Tests.declare(100.0);");
                        return Tests.declare(100.0);
                    }).then(function(declare) {
                        console.log(declare);
                        console.log("expense = declare;\n");
                        expense = declare;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(!expense['automaticApproval'], true);\n");
                        assert.strictEqual(!expense['automaticApproval'], true);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return expense.submit();");
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(\"Submitted\", expense['status']);\n");
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
            return Q().then(function() {
                return Q().then(function() {
                    console.log("return Tests.declare(100.0);");
                    return Tests.declare(100.0);
                }).then(function(declare) {
                    console.log(declare);
                    console.log("expense = declare;\n");
                    expense = declare;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return expense.submit();");
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("expense.reject(\"Non-reimbursable\");\n");
                    expense.reject("Non-reimbursable");
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("assert.equal(\"Rejected\", expense['status']);\n");
                    assert.equal("Rejected", expense['status']);
                });
            });
        };
        behavior().then(done, done);
    });
});

