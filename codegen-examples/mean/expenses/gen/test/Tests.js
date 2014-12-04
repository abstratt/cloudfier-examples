
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
                console.log("emp = mongoose.model('Employee').find();\n");
                emp = mongoose.model('Employee').find();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("cat = mongoose.model('Category').find();\n");
                cat = mongoose.model('Category').find();
            });
        }).then(function() {
            return Q.all([
                Q().then(function() {
                    console.log("return Q.npost(Double, 'findOne', [ ({ _id : amount._id }) ]);");
                    return Q.npost(Double, 'findOne', [ ({ _id : amount._id }) ]);
                }),
                Q().then(function() {
                    console.log("return new Date();");
                    return new Date();
                }),
                Q().then(function() {
                    console.log("return cat;");
                    return cat;
                }),
                Q().then(function() {
                    console.log("return emp;");
                    return emp;
                })
            ]).spread(function(amount, today, cat, emp) {
                console.log("amount:" + amount);console.log("today:" + today);console.log("cat:" + cat);console.log("emp:" + emp);
                return emp.declareExpense("just a test expense", amount, today, cat);
            }).then(function(declareExpense) {
                console.log("return declareExpense;\n");
                return declareExpense;
            });
        });
    }
};

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(100000);

    test('declaredExpenseRemainsInDraft', function(done) {
        var behavior = function() {
            var expense;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    console.log("return Tests.declare(10.0);");
                    return Tests.declare(10.0);
                }).then(function(declare) {
                    console.log("expense = declare;\n");
                    expense = declare;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("assert.equal(\"Draft\", expense.status);\n");
                    assert.equal("Draft", expense.status);
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
                    console.log("assert.strictEqual(declare.isAutomaticApproval(), true);\n");
                    assert.strictEqual(declare.isAutomaticApproval(), true);
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Tests.declare(50.0);");
                    return Tests.declare(50.0);
                }).then(function(declare) {
                    console.log("assert.strictEqual(!(declare.isAutomaticApproval()), true);\n");
                    assert.strictEqual(!(declare.isAutomaticApproval()), true);
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
                        console.log("expense = declare;\n");
                        expense = declare;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(expense.isAutomaticApproval(), true);\n");
                        assert.strictEqual(expense.isAutomaticApproval(), true);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("return expense.submit();");
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("assert.equal(\"Approved\", expense.status);\n");
                    assert.equal("Approved", expense.status);
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
                        console.log("expense = declare;\n");
                        expense = declare;
                    });
                }).then(function() {
                    return Q().then(function() {
                        console.log("assert.strictEqual(!(expense.isAutomaticApproval()), true);\n");
                        assert.strictEqual(!(expense.isAutomaticApproval()), true);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("return expense.submit();");
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("assert.equal(\"Submitted\", expense.status);\n");
                    assert.equal("Submitted", expense.status);
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
                    console.log("expense = declare;\n");
                    expense = declare;
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("return expense.submit();");
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("return expense.reject(\"Non-reimbursable\");");
                    return expense.reject("Non-reimbursable");
                });
            }).then(function() {
                return Q().then(function() {
                    console.log("return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);");
                    return Q.npost(Expense, 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    console.log("assert.equal(\"Rejected\", expense.status);\n");
                    assert.equal("Rejected", expense.status);
                });
            });
        };
        behavior().then(done, done);
    });
});

