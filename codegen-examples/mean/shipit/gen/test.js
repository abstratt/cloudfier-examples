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

var createUser = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.fullName = values.fullName || "fullName-value";
    return createInstance('shipit.User', toCreate);
};

var createLabel = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('shipit.Label', toCreate);
};

var createProject = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.description = values.description || "description-value";
    toCreate.token = values.token || "token-value";
    return createInstance('shipit.Project', toCreate);
};

var createIssue = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.summary = values.summary || "summary-value";
    toCreate.description = values.description || "description-value";
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createProject().then(function(requiredInstance) {
            toCreate.project = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('shipit.Issue', toCreate);
    });
    return promise;
};

suite('Shipit CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('User', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('shipit.User').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "shipit.User");
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
            createUser().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
        test('GET one', function(done) {
            var created;
            createUser().then(function(result) {
                created = result;
                return kirra.performRequestOnURL(created.uri, null, 200);
            }).then(function(retrieved) {
                assert.ok(retrieved);
                assert.ok(retrieved.uri);
            }).then(done, done);
        });
        
        test('PUT', function(done) {
            var created;
            createUser().then(function(result) {
                created = result;
                return kirra.performRequestOnURL(created.uri, 'PUT', 200, created);
            }).then(function(updated) {
                assert.ok(updated);
                assert.ok(updated.uri);
            }).then(done, done);
        });
        
    });
    
    
    suite('Label', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('shipit.Label').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "shipit.Label");
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
            createLabel().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
        test('GET one', function(done) {
            var created;
            createLabel().then(function(result) {
                created = result;
                return kirra.performRequestOnURL(created.uri, null, 200);
            }).then(function(retrieved) {
                assert.ok(retrieved);
                assert.ok(retrieved.uri);
            }).then(done, done);
        });
        
        test('PUT', function(done) {
            var created;
            createLabel().then(function(result) {
                created = result;
                return kirra.performRequestOnURL(created.uri, 'PUT', 200, created);
            }).then(function(updated) {
                assert.ok(updated);
                assert.ok(updated.uri);
            }).then(done, done);
        });
        
    });
    
    
    suite('Project', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('shipit.Project').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "shipit.Project");
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
            createProject().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
        test('GET one', function(done) {
            var created;
            createProject().then(function(result) {
                created = result;
                return kirra.performRequestOnURL(created.uri, null, 200);
            }).then(function(retrieved) {
                assert.ok(retrieved);
                assert.ok(retrieved.uri);
            }).then(done, done);
        });
        
        test('PUT', function(done) {
            var created;
            createProject().then(function(result) {
                created = result;
                return kirra.performRequestOnURL(created.uri, 'PUT', 200, created);
            }).then(function(updated) {
                assert.ok(updated);
                assert.ok(updated.uri);
            }).then(done, done);
        });
        
    });
    
    
    suite('Issue', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('shipit.Issue').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "shipit.Issue");
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
