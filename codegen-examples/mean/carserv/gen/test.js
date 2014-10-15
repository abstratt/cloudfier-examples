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

var createMake = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    return createInstance('carserv.Make', toCreate);
};

var createCustomer = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.firstName = values.firstName || "firstName-value";
    toCreate.lastName = values.lastName || "lastName-value";
    toCreate.title = values.title || "Mr";
    return createInstance('carserv.Customer', toCreate);
};

var createModel = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.name = values.name || "name-value";
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createMake().then(function(requiredInstance) {
            toCreate.make = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('carserv.Model', toCreate);
    });
    return promise;
};

var createAutoMechanic = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.firstName = values.firstName || "firstName-value";
    toCreate.lastName = values.lastName || "lastName-value";
    return createInstance('carserv.AutoMechanic', toCreate);
};

var createCar = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.registrationNumber = values.registrationNumber || "registrationNumber-value";
    // set required relationships (via callbacks)
    var promise = q();
    promise = promise.then(function() {
        return createModel().then(function(requiredInstance) {
            toCreate.model = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createCustomer().then(function(requiredInstance) {
            toCreate.owner = { objectId: requiredInstance.objectId };
        });
    });
    promise = promise.then(function() {
        return createInstance('carserv.Car', toCreate);
    });
    return promise;
};

var createService = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.description = values.description || "description-value";
    return createInstance('carserv.Service', toCreate);
};

var createPerson = function (values) {
    var toCreate = {};
    values = values || {};
    // set required properties
    toCreate.firstName = values.firstName || "firstName-value";
    toCreate.lastName = values.lastName || "lastName-value";
    return createInstance('carserv.Person', toCreate);
};

suite('Carserv CRUD tests', function() {
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('Make', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('carserv.Make').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "carserv.Make");
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
            createMake().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Customer', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('carserv.Customer').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "carserv.Customer");
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
    
    
    suite('Model', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('carserv.Model').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "carserv.Model");
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
            createModel().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('AutoMechanic', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('carserv.AutoMechanic').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "carserv.AutoMechanic");
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
            createAutoMechanic().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Car', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('carserv.Car').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "carserv.Car");
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
            createCar().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Service', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('carserv.Service').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "carserv.Service");
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
    
    
    suite('Person', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('carserv.Person').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "carserv.Person");
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
            createPerson().then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
});    
