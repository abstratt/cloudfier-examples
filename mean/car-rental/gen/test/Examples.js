require('../models/index.js');

var Q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var CarModel = require('../models/CarModel.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = {
    newMake : function() {
        var make;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                make = new require('../models/Make.js')();
            });
        }).then(function() {
            return Q().then(function() {
                make['name'] = "Fiat";
            });
        }).then(function() {
            return Q().then(function() {
                return make;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(make, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    },
    newModel : function() {
        var carModel;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                carModel = new require('../models/CarModel.js')();
            });
        }).then(function() {
            return Q().then(function() {
                carModel['name'] = "Mille";
            });
        }).then(function() {
            return Q().then(function() {
                return Examples.newMake();
            }).then(function(newMake) {
                carModel.make = newMake._id;
                newMake.models.push(carModel._id);
            });
        }).then(function() {
            return Q().then(function() {
                return carModel;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(carModel, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    },
    newCar : function() {
        var car;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                car = new require('../models/Car.js')();
            });
        }).then(function() {
            return Q().then(function() {
                car['year'] = (new Date().getYear() + 1900);
            });
        }).then(function() {
            return Q().then(function() {
                car['price'] = 100;
            });
        }).then(function() {
            return Q().then(function() {
                car['color'] = "black";
            });
        }).then(function() {
            return Q().then(function() {
                car['plate'] = "ABC-1234";
            });
        }).then(function() {
            return Q().then(function() {
                return Examples.newModel();
            }).then(function(newModel) {
                car.model = newModel._id
                ;
            });
        }).then(function() {
            return Q().then(function() {
                return car;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(car, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    },
    newCustomer : function() {
        var customer;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                customer = new require('../models/Customer.js')();
            });
        }).then(function() {
            return Q().then(function() {
                customer['name'] = "Joana de Almeida";
            });
        }).then(function() {
            return Q().then(function() {
                return customer;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(customer, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    }
};

exports = module.exports = Examples; 
