require('../models/index.js');

var Q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = {
    newMake : function() {
        var make;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                console.log("make = new Make();\n");
                make = new Make();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("make['name'] = \"Fiat\";\n");
                make['name'] = "Fiat";
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return make;\n");
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
                console.log("carModel = new Model();\n");
                carModel = new Model();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("carModel['name'] = \"Mille\";\n");
                carModel['name'] = "Mille";
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Examples.newMake();");
                return Examples.newMake();
            }).then(function(newMake) {
                console.log("carModel.make = newMake._id;\nnewMake.models.push(carModel._id);\n");
                carModel.make = newMake._id;
                newMake.models.push(carModel._id);
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return carModel;\n");
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
                console.log("car = new Car();\n");
                car = new Car();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("car['year'] = (new Date().getYear() + 1900);\n");
                car['year'] = (new Date().getYear() + 1900);
            });
        }).then(function() {
            return Q().then(function() {
                console.log("car['price'] = 100;\n");
                car['price'] = 100;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("car['color'] = \"black\";\n");
                car['color'] = "black";
            });
        }).then(function() {
            return Q().then(function() {
                console.log("car['plate'] = \"ABC-1234\";\n");
                car['plate'] = "ABC-1234";
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Examples.newModel();");
                return Examples.newModel();
            }).then(function(newModel) {
                console.log("car.model = newModel._id\n;\n");
                car.model = newModel._id
                ;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return car;\n");
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
                console.log("customer = new Customer();\n");
                customer = new Customer();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("customer['name'] = \"Joana de Almeida\";\n");
                customer['name'] = "Joana de Almeida";
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return customer;\n");
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
