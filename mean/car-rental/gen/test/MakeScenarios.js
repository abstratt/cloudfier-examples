
var assert = require("assert");
var Q = require("q");
var mongoose = require('../models/db.js');
require('../models/index.js');        


var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var CarModel = require('../models/CarModel.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - MakeScenarios', function() {
    this.timeout(100000);

    test('creation', function(done) {
        var behavior = function() {
            var carMake;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Examples.newMake();
                }).then(function(newMakeResult) {
                    carMake = newMakeResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : carMake._id }) ]);
                    }).then(function(carMake) {
                        assert.ok(carMake != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : carMake._id }) ]);
                    }).then(function(carMake) {
                        assert.ok(carMake.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : carMake._id }) ]);
                    }).then(function(carMake) {
                        assert.equal("Fiat", carMake.name);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

