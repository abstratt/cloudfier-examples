var Kirra = require("./kirra-client.js");
var helpers = require('./helpers.js');
var util = require('util');

var assert = require("assert");
var user = process.env.KIRRA_USER || 'test';
var folder = process.env.KIRRA_FOLDER || 'cloudfier-examples';

suite('Car rental CRUD tests', function() {
    var kirraBaseUrl = process.env.KIRRA_BASE_URL || "http://localhost:48084";
    var kirraApiUrl = process.env.KIRRA_API_URL || (kirraBaseUrl);
    var kirra = new Kirra(kirraApiUrl);
    this.timeout(10000);

    var checkStatus = function(m, expected) {
        assert.equal(m.status, expected, JSON.stringify(m.error || ''));
    };


    suite('Car', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('car_rental.Car').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "car_rental.Car");
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
        var template;
        test('GET template', function(done) {
            kirra.performRequestOnURL(entity.templateUri, null, 200).then(function(fetched) {
                assert.ok(fetched); 
                template = fetched;
            }).then(done, done);
        });
        test('POST', function(done) {
            kirra.performRequestOnURL(entity.extentUri, 'POST', 201, template).then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Rental', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('car_rental.Rental').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "car_rental.Rental");
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
        var template;
        test('GET template', function(done) {
            kirra.performRequestOnURL(entity.templateUri, null, 200).then(function(fetched) {
                assert.ok(fetched); 
                template = fetched;
            }).then(done, done);
        });
        test('POST', function(done) {
            kirra.performRequestOnURL(entity.extentUri, 'POST', 201, template).then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Model', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('car_rental.Model').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "car_rental.Model");
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
        var template;
        test('GET template', function(done) {
            kirra.performRequestOnURL(entity.templateUri, null, 200).then(function(fetched) {
                assert.ok(fetched); 
                template = fetched;
            }).then(done, done);
        });
        test('POST', function(done) {
            kirra.performRequestOnURL(entity.extentUri, 'POST', 201, template).then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Make', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('car_rental.Make').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "car_rental.Make");
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
        var template;
        test('GET template', function(done) {
            kirra.performRequestOnURL(entity.templateUri, null, 200).then(function(fetched) {
                assert.ok(fetched); 
                template = fetched;
            }).then(done, done);
        });
        test('POST', function(done) {
            kirra.performRequestOnURL(entity.extentUri, 'POST', 201, template).then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
    
    suite('Customer', function() {
        var entity;
        test('GET entity', function(done) {
            kirra.getExactEntity('car_rental.Customer').then(function(fetched) {
                entity = fetched; 
                assert.equal(fetched.fullName, "car_rental.Customer");
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
        var template;
        test('GET template', function(done) {
            kirra.performRequestOnURL(entity.templateUri, null, 200).then(function(fetched) {
                assert.ok(fetched); 
                template = fetched;
            }).then(done, done);
        });
        test('POST', function(done) {
            kirra.performRequestOnURL(entity.extentUri, 'POST', 201, template).then(function(created) {
                assert.ok(created);
                assert.ok(created.uri);
            }).then(done, done);
        });
    });
    
});    
