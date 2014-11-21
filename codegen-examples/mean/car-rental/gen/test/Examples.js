var mongoose = require('mongoose');
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = {
    newMake : function() {
        var make;
        return q().then(function() {
            return q().then(function() {
                make = new Make();
            });
        }).then(function() {
            return q().then(function() {
                make['name'] = "Fiat";
            });
        }).then(function() {
            return q().then(function() {
                make.save();
                return q(make);
            });
        });
    },
    newModel : function() {
        var carModel;
        return q().then(function() {
            return q().then(function() {
                carModel = new Model();
            });
        }).then(function() {
            return q().then(function() {
                carModel['name'] = "Mille";
            });
        }).then(function() {
            return q().then(function() {
                return Examples.newMake();
            }).then(function(call_newMake) {
                carModel['make'] = call_newMake;
            });
        }).then(function() {
            return q().then(function() {
                carModel.save();
                return q(carModel);
            });
        });
    },
    newCar : function() {
        var car;
        return q().then(function() {
            return q().then(function() {
                car = new Car();
            });
        }).then(function() {
            return q().then(function() {
                car['year'] = (new Date().getYear() + 1900);
            });
        }).then(function() {
            return q().then(function() {
                car['price'] = 100;
            });
        }).then(function() {
            return q().then(function() {
                car['color'] = "black";
            });
        }).then(function() {
            return q().then(function() {
                car['plate'] = "ABC-1234";
            });
        }).then(function() {
            return q().then(function() {
                return Examples.newModel();
            }).then(function(call_newModel) {
                car['model'] = call_newModel;
            });
        }).then(function() {
            return q().then(function() {
                car.save();
                return q(car);
            });
        });
    },
    newCustomer : function() {
        var customer;
        return q().then(function() {
            return q().then(function() {
                customer = new Customer();
            });
        }).then(function() {
            return q().then(function() {
                customer['name'] = "Joana de Almeida";
            });
        }).then(function() {
            return q().then(function() {
                customer.save();
                return q(customer);
            });
        });
    }
};

exports = module.exports = Examples; 
