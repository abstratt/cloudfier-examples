var mongoose = require('mongoose');
var q = require("q");
var Car = require('../models/Car.js');
var Rental = require('../models/Rental.js');
var Model = require('../models/Model.js');
var Make = require('../models/Make.js');
var Customer = require('../models/Customer.js');

var Examples = {
    make : function() {
        // isAsynchronous: true        
        console.log("make = new Make()");
        make = new Make();
        
        console.log("make.name = 'Fiat'");
        make.name = "Fiat";
        
        console.log("return make");
        return make;
    },
    model : function() {
        // isAsynchronous: true        
        console.log("carModel = new Model()");
        carModel = new Model();
        
        console.log("carModel.name = 'Mille'");
        carModel.name = "Mille";
        
        console.log("carModel.make = Examples.make()");
        carModel.make = Examples.make();
        
        console.log("return carModel");
        return carModel;
    },
    car : function() {
        // isAsynchronous: true        
        console.log("car = new Car()");
        car = new Car();
        
        console.log("car.year = (new Date().getYear() + 1900)");
        car.year = (new Date().getYear() + 1900);
        
        console.log("car.price = 100");
        car.price = 100;
        
        console.log("car.color = 'black'");
        car.color = "black";
        
        console.log("car.plate = 'ABC-1234'");
        car.plate = "ABC-1234";
        
        console.log("car.model = Examples.model()");
        car.model = Examples.model();
        
        console.log("return car");
        return car;
    },
    customer : function() {
        // isAsynchronous: true        
        console.log("customer = new Customer()");
        customer = new Customer();
        
        console.log("customer.name = 'Joana de Almeida'");
        customer.name = "Joana de Almeida";
        
        console.log("return customer");
        return customer;
    }
};

exports = module.exports = Examples; 
