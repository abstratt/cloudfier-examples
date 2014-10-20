var mongoose = require('mongoose');
require('../models');

var Examples = {
    make : function() {
        var make = new require('../models/Make.js') ();
        make.name = "Fiat";
        return make;
    },
    model : function() {
        var carModel = new require('../models/Model.js') ();
        carModel.name = "Mille";
        carModel.make = require('./Examples.js').make();
        return carModel;
    },
    car : function() {
        var car = new require('../models/Car.js') ();
        car.year = new Date().getYear();
        car.price = 100;
        car.color = "black";
        car.plate = "ABC-1234";
        car.model = require('./Examples.js').model();
        return car;
    },
    customer : function() {
        var customer = new require('../models/Customer.js') ();
        customer.name = "Joana de Almeida";
        return customer;
    }
};

exports = module.exports = Examples; 
