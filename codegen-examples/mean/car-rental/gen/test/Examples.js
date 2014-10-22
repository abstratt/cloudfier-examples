var mongoose = require('mongoose');
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = {
    make : function() {
        make = new Make();
        make.name = "Fiat";
        return make;
    },
    model : function() {
        carModel = new Model();
        carModel.name = "Mille";
        carModel.make = Examples.make();
        return carModel;
    },
    car : function() {
        car = new Car();
        car.year = (new Date().getYear() + 1900);
        car.price = 100;
        car.color = "black";
        car.plate = "ABC-1234";
        car.model = Examples.model();
        return car;
    },
    customer : function() {
        customer = new Customer();
        customer.name = "Joana de Almeida";
        return customer;
    }
};

exports = module.exports = Examples; 
