
var mongoose = require('mongoose');
var HttpClient = require("../http-client.js");
var helpers = require('../helpers.js');
var util = require('util');
var q = require('q');

var assert = require("assert");
var folder = process.env.KIRRA_FOLDER || 'cloudfier-examples';

var kirraBaseUrl = process.env.KIRRA_BASE_URL || "http://localhost:48084";
var kirraApiUrl = process.env.KIRRA_API_URL || (kirraBaseUrl);
var httpClient = new HttpClient(kirraApiUrl);

suite('Expenses Application functional tests - Tests', function() {
    this.timeout(10000);

    var declare = function(amount) {
        
    };
    
    test('declaredExpenseRemainsInDraft', function(done) {
        // a block
        var expense = require('./Tests.js').declare(10.0);
        assert.equal(null, expense.status), 'null == expense.status' ;
        done();
    });
    test('automaticApproval', function(done) {
        // a block
        assert.ok(require('./Tests.js').declare(49.9).automaticApproval === true, 'require('./Tests.js').declare(49.9).automaticApproval: ' + require('./Tests.js').declare(49.9).automaticApproval);
        assert.ok(!(require('./Tests.js').declare(50.0).automaticApproval) === true, '!(require('./Tests.js').declare(50.0).automaticApproval): ' + !(require('./Tests.js').declare(50.0).automaticApproval));
        done();
    });
    test('submitExpenseUnder50IsAutomaticallyApproved', function(done) {
        // a block
        var expense = require('./Tests.js').declare(10.0);
        assert.ok(expense.automaticApproval === true, 'expense.automaticApproval: ' + expense.automaticApproval);
        expense.submit();
        assert.equal(null, expense.status), 'null == expense.status' ;
        done();
    });
    test('submitExpense50AndOverNeedsApproval', function(done) {
        // a block
        var expense = require('./Tests.js').declare(100.0);
        assert.ok(!(expense.automaticApproval) === true, '!(expense.automaticApproval): ' + !(expense.automaticApproval));
        expense.submit();
        assert.equal(null, expense.status), 'null == expense.status' ;
        done();
    });
    test('rejectedExpense', function(done) {
        // a block
        var expense = require('./Tests.js').declare(100.0);
        expense.submit();
        expense.reject(Unsupported classifier Memo for operation fromString);
        assert.equal(null, expense.status), 'null == expense.status' ;
        done();
    });
});

