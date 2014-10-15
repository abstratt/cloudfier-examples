var Kirra = require("./kirra-client.js");
var helpers = require('./helpers.js');
var util = require('util');
var q = require('q');

var assert = require("assert");
var user = process.env.KIRRA_USER || 'test';
var folder = process.env.KIRRA_FOLDER || 'cloudfier-examples';

var kirraBaseUrl = process.env.KIRRA_BASE_URL || "http://localhost:48084";
var kirraApiUrl = process.env.KIRRA_API_URL || (kirraBaseUrl);
var kirra = new Kirra(kirraApiUrl);

var createInstance = function(entityName, values) {
    var entity;
    return kirra.getExactEntity(entityName).then(function(fetchedEntity) {
        entity = fetchedEntity;
        return kirra.performRequestOnURL(entity.templateUri, null, 200);
    }).then(function(template) {
        var toCreate = helpers.merge(template, values);
        return kirra.performRequestOnURL(entity.extentUri, 'POST', 201, toCreate);
    });
};

var createEmployee = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('expenses.Employee', toCreate);
};

var createCategory = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('expenses.Category', toCreate);
};

var createExpense = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    return createInstance('expenses.Expense', toCreate);
};

suite('Expenses Application CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('Employee', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('expenses.Employee').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "expenses.Employee");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            kirra.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createEmployee().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Category', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('expenses.Category').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "expenses.Category");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            kirra.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createCategory().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Expense', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('expenses.Expense').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "expenses.Expense");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri === undefined);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            kirra.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
    });
    
});    
