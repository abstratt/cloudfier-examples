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
                console.log("return Q.npost(make, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
                return Q.npost(make, 'save', [  ]).then(function(saveResult) {
                    return saveResult[0];
                });
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
                console.log(newMake);
                console.log("console.log(\"This: \");\nconsole.log(newMake);\nconsole.log(\"That: \");\nconsole.log(carModel);\ncarModel.make = newMake._id;\nconsole.log(\"This: \");\nconsole.log(carModel);\nconsole.log(\"That: \");\nconsole.log(newMake);\nnewMake.models.push(carModel._id);\n");
                console.log("This: ");
                console.log(newMake);
                console.log("That: ");
                console.log(carModel);
                carModel.make = newMake._id;
                console.log("This: ");
                console.log(carModel);
                console.log("That: ");
                console.log(newMake);
                newMake.models.push(carModel._id);
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(carModel, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
                return Q.npost(carModel, 'save', [  ]).then(function(saveResult) {
                    return saveResult[0];
                });
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
                console.log(newModel);
                console.log("console.log(\"This: \");\nconsole.log(newModel);\nconsole.log(\"That: \");\nconsole.log(car);\ncar.model = newModel._id\n;\n");
                console.log("This: ");
                console.log(newModel);
                console.log("That: ");
                console.log(car);
                car.model = newModel._id
                ;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(car, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
                return Q.npost(car, 'save', [  ]).then(function(saveResult) {
                    return saveResult[0];
                });
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
                console.log("return Q.npost(customer, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
                return Q.npost(customer, 'save', [  ]).then(function(saveResult) {
                    return saveResult[0];
                });
            });
        });
    }
};

exports = module.exports = Examples; 
