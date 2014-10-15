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

var createCategory = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('petstore.Category', toCreate);
};

var createCustomer = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('petstore.Customer', toCreate);
};

var createOrder = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createCustomer().then(function(requiredInstance) {
            toCreate.customer = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('petstore.Order', toCreate);
    });
    return promise;
};

var createProduct = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.productName = values.productName || "productName-value";
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createCategory().then(function(requiredInstance) {
            toCreate.category = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('petstore.Product', toCreate);
    });
    return promise;
};

suite('Petstore CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('Category', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('petstore.Category').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "petstore.Category");
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
    
    
    suite('Customer', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('petstore.Customer').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "petstore.Customer");
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
            createCustomer().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Order', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('petstore.Order').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "petstore.Order");
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
            createOrder().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Product', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('petstore.Product').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "petstore.Product");
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
            createProduct().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
});    
