
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
                emp = mongoose.model('Employee').find();
            });
        }).then(function() {
            return Q().then(function() {
                cat = mongoose.model('Category').find();
            });
        }).then(function() {
            return Q.all([
                Q().then(function() {
                    return Q.npost(Double, 'findOne', [ ({ _id : amount._id }) ]);
                }),
                Q().then(function() {
                    return new Date();
                }),
                Q().then(function() {
                    return cat;
                }),
                Q().then(function() {
                    return emp;
                })
            ]).spread(function(amount, today, cat, emp) {
                return emp.declareExpense("just a test expense", amount, today, cat);
            }).then(function(declareExpense) {
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
                    return Tests.declare(10.0);
                }).then(function(declare) {
                    expense = declare;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
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
                    return Tests.declare(49.9);
                }).then(function(declare) {
                    assert.strictEqual(declare.isAutomaticApproval(), true);
                });
            }).then(function() {
                return Q().then(function() {
                    return Tests.declare(50.0);
                }).then(function(declare) {
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
                        return Tests.declare(10.0);
                    }).then(function(declare) {
                        expense = declare;
                    });
                }).then(function() {
                    return Q().then(function() {
                        assert.strictEqual(expense.isAutomaticApproval(), true);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
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
                        return Tests.declare(100.0);
                    }).then(function(declare) {
                        expense = declare;
                    });
                }).then(function() {
                    return Q().then(function() {
                        assert.strictEqual(!(expense.isAutomaticApproval()), true);
                    });
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
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
                    return Tests.declare(100.0);
                }).then(function(declare) {
                    expense = declare;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    return expense.submit();
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    return expense.reject("Non-reimbursable");
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(require('../models/Expense.js'), 'findOne', [ ({ _id : expense._id }) ]);
                }).then(function(expense) {
                    assert.equal("Rejected", expense.status);
                });
            });
        };
        behavior().then(done, done);
    });
});

