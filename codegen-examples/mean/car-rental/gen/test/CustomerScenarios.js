
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
var Examples = require('./Examples.js');

suite('Car rental functional tests - CustomerScenarios', function() {
    this.timeout(10000);

    
    test('rentalHistory', function(done) {
        // a block
        var car = require('./Examples.js').car();
        var customer = require('./Examples.js').customer();
        customer.rent(car);
        assert.equal(1, count), '1 == count' ;
        customer.finishRental();
        customer.rent(car);
        assert.equal(2, count), '2 == count' ;
        done();
    });
});

