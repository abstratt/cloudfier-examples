require('../models/index.js');

var Q = require("q");
var mongoose = require('../models/db.js');
var TestData = {
    build : function() {
        var california;
        var oregon;
        var wyoming;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                return TestData.newState("California", "CA");
            }).then(function(newStateResult) {
                california = newStateResult;
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newCity("San Francisco", 837442, california);
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newCity("San Mateo", 101128, california);
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newCity("San Diego", 1356000, california);
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newState("Oregon", "OR");
            }).then(function(newStateResult) {
                oregon = newStateResult;
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newCity("Portland", 609456, oregon);
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newCity("Eugene", 159190, oregon);
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newState("Wyoming", "WY");
            }).then(function(newStateResult) {
                wyoming = newStateResult;
            });
        }).then(function() {
            return Q().then(function() {
                return TestData.newCity("Cheyenne", 62448, wyoming);
            });
        });
    },
    newCity : function(name, population, cityState) {
        var city;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                city = new require('../models/City.js')();
            });
        }).then(function() {
            return Q().then(function() {
                city['name'] = name;
            });
        }).then(function() {
            return Q().then(function() {
                city['population'] = population;
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(require('../models/State.js'), 'findOne', [ ({ _id : cityState._id }) ]);
            }).then(function(cityState) {
                city.cityState = cityState._id;
                cityState.cities.push(city._id);
            });
        }).then(function() {
            return Q().then(function() {
                return city;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(city, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    },
    newState : function(name, abbreviation) {
        var newState;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                newState = new require('../models/State.js')();
            });
        }).then(function() {
            return Q().then(function() {
                newState['name'] = name;
            });
        }).then(function() {
            return Q().then(function() {
                newState['abbreviation'] = abbreviation;
            });
        }).then(function() {
            return Q().then(function() {
                return newState;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(newState, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    }
};

exports = module.exports = TestData; 
