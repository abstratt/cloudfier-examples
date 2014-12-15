
var assert = require("assert");
var Q = require("q");
require('../models/index.js');        


var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var CarModel = require('../models/CarModel.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = require('./Examples.js');


suite('Car rental functional tests - ModelScenarios', function() {
    this.timeout(100000);

    test('creation', function(done) {
        var behavior = function() {
            var carModel;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return Examples.newModel();
                }).then(function(newModel) {
                    carModel = newModel;
                });
            }).then(function() {
                return Q().then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : carModel._id }) ]);
                    }).then(function(carModel) {
                        assert.ok(carModel != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : carModel._id }) ]);
                    }).then(function(carModel) {
                        assert.ok(carModel.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : carModel._id }) ]);
                    }).then(function(carModel) {
                        assert.equal("Mille", carModel.name);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : carModel._id }) ]);
                    }).then(function(carModel) {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : carModel.make }) ]);
                    }).then(function(make) {
                        assert.ok(make != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : carModel._id }) ]);
                    }).then(function(carModel) {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : carModel.make }) ]);
                    }).then(function(make) {
                        assert.ok(make.name != null);
                    });
                }).then(function() {
                    return Q().then(function() {
                        return Q.npost(require('../models/CarModel.js'), 'findOne', [ ({ _id : carModel._id }) ]);
                    }).then(function(carModel) {
                        return Q.npost(require('../models/Make.js'), 'findOne', [ ({ _id : carModel.make }) ]);
                    }).then(function(make) {
                        assert.equal("Fiat", make.name);
                    });
                });
            });
        };
        behavior().then(done, done);
    });
});

