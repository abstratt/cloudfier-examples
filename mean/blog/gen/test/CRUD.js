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

var createUser = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('blog.User', toCreate);
};

var createArticle = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.title = values.title || "title-value";
    toCreate.body = values.body || "body-value";
    return createInstance('blog.Article', toCreate);
};

suite('Blog CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('User', function() {
        var entity;
        test('GET entity', function(done) {
            getExactEntity('blog.User').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "blog.User");
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
            createUser().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
        test('GET one', function(done) {
            var created;
            createUser().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, null, 200);
            }).then(function(retrieved) {
                assert.ok(retrieved);
                assert.ok(retrieved.uri);
            }).then(done, done);
        });
        
        test('PUT', function(done) {
            var created;
            createUser().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, 'PUT', 200, created);
            }).then(function(updated) {
                assert.ok(updated);
                assert.ok(updated.uri);
            }).then(done, done);
        });
        
    });
    
    
    suite('Article', function() {
        var entity;
        test('GET entity', function(done) {
            getExactEntity('blog.Article').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "blog.Article");
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
            createArticle().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
        test('GET one', function(done) {
            var created;
            createArticle().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, null, 200);
            }).then(function(retrieved) {
                assert.ok(retrieved);
                assert.ok(retrieved.uri);
            }).then(done, done);
        });
        
        test('PUT', function(done) {
            var created;
            createArticle().then(function(result) {
                created = result;
                return httpClient.performRequestOnURL(created.uri, 'PUT', 200, created);
            }).then(function(updated) {
                assert.ok(updated);
                assert.ok(updated.uri);
            }).then(done, done);
        });
        
    });
    
});    
