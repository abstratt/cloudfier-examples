var mongoose = require('mongoose');
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
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("make = new Make();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                make = new Make();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("make['name'] = <Q>Fiat<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                make['name'] = "Fiat";
            });
        }).then(function() {
            return Q.when(function() {
                console.log("make.save();<NL>return q(make);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                make.save();
                return q(make);
            });
        });
    },
    newModel : function() {
        var carModel;
        var me = this;
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("carModel = new Model();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                carModel = new Model();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("carModel['name'] = <Q>Mille<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                carModel['name'] = "Mille";
            });
        }).then(function() {
            return Q.when(function() {
                console.log("return Examples.newMake();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return Examples.newMake();
            }).then(function(call_newMake) {
                carModel['make'] = call_newMake;
            });
        }).then(function() {
            return Q.when(function() {
                console.log("carModel.save();<NL>return q(carModel);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                carModel.save();
                return q(carModel);
            });
        });
    },
    newCar : function() {
        var car;
        var me = this;
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("car = new Car();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                car = new Car();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("car['year'] = (new Date().getYear() + 1900);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                car['year'] = (new Date().getYear() + 1900);
            });
        }).then(function() {
            return Q.when(function() {
                console.log("car['price'] = 100;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                car['price'] = 100;
            });
        }).then(function() {
            return Q.when(function() {
                console.log("car['color'] = <Q>black<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                car['color'] = "black";
            });
        }).then(function() {
            return Q.when(function() {
                console.log("car['plate'] = <Q>ABC-1234<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                car['plate'] = "ABC-1234";
            });
        }).then(function() {
            return Q.when(function() {
                console.log("return Examples.newModel();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return Examples.newModel();
            }).then(function(call_newModel) {
                car['model'] = call_newModel;
            });
        }).then(function() {
            return Q.when(function() {
                console.log("car.save();<NL>return q(car);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                car.save();
                return q(car);
            });
        });
    },
    newCustomer : function() {
        var customer;
        var me = this;
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("customer = new Customer();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                customer = new Customer();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("customer['name'] = <Q>Joana de Almeida<Q>;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                customer['name'] = "Joana de Almeida";
            });
        }).then(function() {
            return Q.when(function() {
                console.log("customer.save();<NL>return q(customer);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                customer.save();
                return q(customer);
            });
        });
    }
};

exports = module.exports = Examples; 
