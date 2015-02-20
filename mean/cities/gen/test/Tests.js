
var assert = require("assert");
var Q = require("q");
var mongoose = require('../models/db.js');
require('../models/index.js');        


var City = require('../models/City.js');
var State = require('../models/State.js');

var TestData = require('./TestData.js');

var Tests = {
    statsFinder : function(abbreviation) {
        var me = this;
        return Q().then(function() {
            return (function() {
                return stat.abbreviation == abbreviation;
            })();
        });
    }
};

suite('Cities functional tests - Tests', function() {
    this.timeout(100000);

    test('stateByAbbreviation', function(done) {
        var behavior = function() {
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return TestData.build();
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').byAbbreviation("OR");
                }).then(function(byAbbreviationResult) {
                    assert.ok(byAbbreviationResult != null);
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').byAbbreviation("ZZ");
                }).then(function(byAbbreviationResult) {
                    assert.ok(byAbbreviationResult == null);
                });
            });
        };
        behavior().then(done, done);
    });
    test('cityByName', function(done) {
        var behavior = function() {
            var california;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return TestData.build();
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').byAbbreviation("CA");
                }).then(function(byAbbreviationResult) {
                    california = byAbbreviationResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return california.city("San Francisco");
                }).then(function(cityResult) {
                    assert.ok(cityResult != null);
                });
            }).then(function() {
                return Q().then(function() {
                    return california.city("FooBar");
                }).then(function(cityResult) {
                    assert.ok(cityResult == null);
                });
            });
        };
        behavior().then(done, done);
    });
    test('statePopulation', function(done) {
        var behavior = function() {
            var oregon;
            var expected;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return TestData.build();
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').byAbbreviation("OR");
                }).then(function(byAbbreviationResult) {
                    oregon = byAbbreviationResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return oregon.getPopulation();
                }).then(function(population) {
                    assert.strictEqual(population > 0, true);
                });
            }).then(function() {
                return Q.all([
                    Q().then(function() {
                        return oregon.city("Eugene");
                    }),
                    Q().then(function() {
                        return oregon.city("Portland");
                    }).then(function(cityResult) {
                        return cityResult.population;
                    })
                ]).spread(function(cityResult, population) {
                    expected = population + cityResult.population;
                });
            }).then(function() {
                return Q().then(function() {
                    return oregon.getPopulation();
                }).then(function(population) {
                    assert.equal(expected, population);
                });
            });
        };
        behavior().then(done, done);
    });
    test('populousStates', function(done) {
        var behavior = function() {
            var populousStateAbbreviations;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return TestData.build();
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').abbreviationsOfStatesMorePopulousThan(500000);
                }).then(function(abbreviationsOfStatesMorePopulousThanResult) {
                    populousStateAbbreviations = abbreviationsOfStatesMorePopulousThanResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return populousStateAbbreviations.length;
                }).then(function(sizeResult) {
                    assert.equal(2, sizeResult);
                });
            }).then(function() {
                return Q().then(function() {
                    return /*TBD*/includes;
                }).then(function(includesResult) {
                    assert.strictEqual(includesResult, true);
                });
            }).then(function() {
                return Q().then(function() {
                    return /*TBD*/includes;
                }).then(function(includesResult) {
                    assert.strictEqual(includesResult, true);
                });
            }).then(function() {
                return Q().then(function() {
                    return /*TBD*/includes;
                }).then(function(includesResult) {
                    assert.strictEqual(!(includesResult), true);
                });
            });
        };
        behavior().then(done, done);
    });
    test('statePopulations', function(done) {
        var behavior = function() {
            var populations;
            var oregon;
            var wyoming;
            var me = this;
            return Q().then(function() {
                return Q().then(function() {
                    return TestData.build();
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').byAbbreviation("OR");
                }).then(function(byAbbreviationResult) {
                    oregon = byAbbreviationResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').byAbbreviation("WY");
                }).then(function(byAbbreviationResult) {
                    wyoming = byAbbreviationResult;
                });
            }).then(function() {
                return Q().then(function() {
                    return require('../models/State.js').statePopulations();
                }).then(function(statePopulationsResult) {
                    populations = statePopulationsResult;
                });
            }).then(function() {
                return Q.all([
                    Q().then(function() {
                        return mongoose.model('State').length;
                    }),
                    Q().then(function() {
                        return populations.length;
                    })
                ]).spread(function(sizeResult, sizeResult) {
                    assert.equal(sizeResult, sizeResult);
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(populations.findOne(), 'exec', [  ]);
                }).then(function(oneResult) {
                    assert.strictEqual(oneResult.population > 0, true);
                });
            }).then(function() {
                return Q().then(function() {
                    return Q.npost(populations.findOne(), 'exec', [  ]);
                }).then(function(oneResult) {
                    assert.equal("CA", oneResult.abbreviation);
                });
            }).then(function() {
                return Q.all([
                    Q().then(function() {
                        return wyoming.getPopulation();
                    }),
                    Q().then(function() {
                        return populations.where({
                            $eq : [ 
                                abbreviation,
                                "WY"
                            ]
                        }).findOne();
                    }).then(function(anyResult) {
                        return anyResult.population;
                    })
                ]).spread(function(population, population) {
                    assert.equal(population, population);
                });
            }).then(function() {
                return Q.all([
                    Q().then(function() {
                        return oregon.getPopulation();
                    }),
                    Q().then(function() {
                        return populations.where({
                            $eq : [ 
                                abbreviation,
                                "OR"
                            ]
                        }).findOne();
                    }).then(function(anyResult) {
                        return anyResult.population;
                    })
                ]).spread(function(population, population) {
                    assert.equal(population, population);
                });
            });
        };
        behavior().then(done, done);
    });
});

