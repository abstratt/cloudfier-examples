require('../server.js');
var HttpClient = require("../http-client.js");
var helpers = require('../helpers.js');
var util = require('util');
var q = require('q');

var assert = require("assert");
var folder = process.env.KIRRA_FOLDER || 'cloudfier-examples';

var kirraBaseUrl = process.env.KIRRA_BASE_URL || "http://localhost:48084";
var kirraApiUrl = process.env.KIRRA_API_URL || (kirraBaseUrl);
var httpClient = new HttpClient(kirraApiUrl);

var getExactEntity = function (entityName) {
    var entityUri = kirraApiUrl + '/entities/' + entityName;
    return httpClient.performRequestOnURL(entityUri, null, 200);
};

var createInstance = function(entityName, values) {
    var entity;
    return getExactEntity(entityName).then(function(fetchedEntity) {
        entity = fetchedEntity;
        return httpClient.performRequestOnURL(entity.templateUri, null, 200);
    }).then(function(template) {
        var toCreate = helpers.merge(template, values);
        return httpClient.performRequestOnURL(entity.extentUri, 'POST', 201, toCreate);
    });
};

var createClient = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('timetracker.Client', toCreate);
};

var createInvoice = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    return createInstance('timetracker.Invoice', toCreate);
};

var createTask = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.description = values.description || "description-value";
    return createInstance('timetracker.Task', toCreate);
};

suite('Time Tracker CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('Client', function() {
        var entity;
        test('GET entity', function(done) {
            getExactEntity('timetracker.Client').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "timetracker.Client");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            httpClient.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createClient().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
        test('GET one', function(done) {
            var created;
            createClient().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, null, 200);
            }).then(function(retrieved) {
                assert.ok(retrieved);
                assert.ok(retrieved.uri);
            }).then(done, done);
        });
        
        test('PUT', function(done) {
            var created;
            createClient().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, 'PUT', 200, created);
            }).then(function(updated) {
                assert.ok(updated);
                assert.ok(updated.uri);
            }).then(done, done);
        });
        
    });
    
    
    suite('Invoice', function() {
        var entity;
        test('GET entity', function(done) {
            getExactEntity('timetracker.Invoice').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "timetracker.Invoice");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri === undefined);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            httpClient.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        
    });
    
    
    suite('Task', function() {
        var entity;
        test('GET entity', function(done) {
            getExactEntity('timetracker.Task').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "timetracker.Task");
                assert.ok(fetched.extentUri);
                assert.ok(fetched.templateUri);
            }).then(done, done);
        });
        test('GET extent', function(done) {
            httpClient.performRequestOnURL(entity.extentUri, null, 200).then(function(instances) {
                assert.ok(typeof instances.length === 'number');
                assert.ok(instances.length >= 0); 
            }).then(done, done);
        });
        test('POST', function(done) {
            createTask().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
        test('GET one', function(done) {
            var created;
            createTask().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, null, 200);
            }).then(function(retrieved) {
                assert.ok(retrieved);
                assert.ok(retrieved.uri);
            }).then(done, done);
        });
        
        test('PUT', function(done) {
            var created;
            createTask().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, 'PUT', 200, created);
            }).then(function(updated) {
                assert.ok(updated);
                assert.ok(updated.uri);
            }).then(done, done);
        });
        
    });
    
});    
