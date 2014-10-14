var mongoose = require('mongoose');

var Car = require('./models/Car.js');
var Rental = require('./models/Rental.js');
var Model = require('./models/Model.js');
var Make = require('./models/Make.js');
var Customer = require('./models/Customer.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            res.json({
                applicationName : "Car rental",
                entities : resolveUrl("entities")
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                   fullName : "car_rental.Car",
                   extentUri : resolveUrl("entities/car_rental.Car/instances"),
                   templateUri : resolveUrl("entities/car_rental.Car/template"),
                   uri : resolveUrl("entities/car_rental.Car")
                },
                 {
                   fullName : "car_rental.Rental",
                   extentUri : resolveUrl("entities/car_rental.Rental/instances"),
                   templateUri : resolveUrl("entities/car_rental.Rental/template"),
                   uri : resolveUrl("entities/car_rental.Rental")
                },
                 {
                   fullName : "car_rental.Model",
                   extentUri : resolveUrl("entities/car_rental.Model/instances"),
                   templateUri : resolveUrl("entities/car_rental.Model/template"),
                   uri : resolveUrl("entities/car_rental.Model")
                },
                 {
                   fullName : "car_rental.Make",
                   extentUri : resolveUrl("entities/car_rental.Make/instances"),
                   templateUri : resolveUrl("entities/car_rental.Make/template"),
                   uri : resolveUrl("entities/car_rental.Make")
                },
                 {
                   fullName : "car_rental.Customer",
                   extentUri : resolveUrl("entities/car_rental.Customer/instances"),
                   templateUri : resolveUrl("entities/car_rental.Customer/template"),
                   uri : resolveUrl("entities/car_rental.Customer")
                }
            ]);
        });
        // routes for car_rental.Car
        app.get("/entities/car_rental.Car", function(req, res) {
            res.json({
               fullName : "car_rental.Car",
               extentUri : resolveUrl("entities/car_rental.Car/instances"),
               templateUri : resolveUrl("entities/car_rental.Car/template"),
               uri : resolveUrl("entities/car_rental.Car")
            });
        });
        app.get("/entities/car_rental.Car/instances", function(req, res) {
            return mongoose.model('Car').find().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json({
                        uri: resolveUrl('entities/car_rental.Car/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Car/template", function(req, res) {
            res.json(new Car());
        });
        app.post("/entities/car_rental.Car/instances", function(req, res) {
            var instanceData = req.body;
            var newCar = new Car();
            for (var p in instanceData) {
                newCar[p] = instanceData[p]; 
            }
            newCar.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.uri = resolveUrl('entities/car_rental.Car/instances/' + created._id);
                    delete created._id;
                    delete created.__v;
                    console.log(created);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Rental
        app.get("/entities/car_rental.Rental", function(req, res) {
            res.json({
               fullName : "car_rental.Rental",
               extentUri : resolveUrl("entities/car_rental.Rental/instances"),
               templateUri : resolveUrl("entities/car_rental.Rental/template"),
               uri : resolveUrl("entities/car_rental.Rental")
            });
        });
        app.get("/entities/car_rental.Rental/instances", function(req, res) {
            return mongoose.model('Rental').find().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json({
                        uri: resolveUrl('entities/car_rental.Rental/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Rental/template", function(req, res) {
            res.json(new Rental());
        });
        app.post("/entities/car_rental.Rental/instances", function(req, res) {
            var instanceData = req.body;
            var newRental = new Rental();
            for (var p in instanceData) {
                newRental[p] = instanceData[p]; 
            }
            newRental.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.uri = resolveUrl('entities/car_rental.Rental/instances/' + created._id);
                    delete created._id;
                    delete created.__v;
                    console.log(created);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Model
        app.get("/entities/car_rental.Model", function(req, res) {
            res.json({
               fullName : "car_rental.Model",
               extentUri : resolveUrl("entities/car_rental.Model/instances"),
               templateUri : resolveUrl("entities/car_rental.Model/template"),
               uri : resolveUrl("entities/car_rental.Model")
            });
        });
        app.get("/entities/car_rental.Model/instances", function(req, res) {
            return mongoose.model('Model').find().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json({
                        uri: resolveUrl('entities/car_rental.Model/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Model/template", function(req, res) {
            res.json(new Model());
        });
        app.post("/entities/car_rental.Model/instances", function(req, res) {
            var instanceData = req.body;
            var newModel = new Model();
            for (var p in instanceData) {
                newModel[p] = instanceData[p]; 
            }
            newModel.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.uri = resolveUrl('entities/car_rental.Model/instances/' + created._id);
                    delete created._id;
                    delete created.__v;
                    console.log(created);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Make
        app.get("/entities/car_rental.Make", function(req, res) {
            res.json({
               fullName : "car_rental.Make",
               extentUri : resolveUrl("entities/car_rental.Make/instances"),
               templateUri : resolveUrl("entities/car_rental.Make/template"),
               uri : resolveUrl("entities/car_rental.Make")
            });
        });
        app.get("/entities/car_rental.Make/instances", function(req, res) {
            return mongoose.model('Make').find().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json({
                        uri: resolveUrl('entities/car_rental.Make/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Make/template", function(req, res) {
            res.json(new Make());
        });
        app.post("/entities/car_rental.Make/instances", function(req, res) {
            var instanceData = req.body;
            var newMake = new Make();
            for (var p in instanceData) {
                newMake[p] = instanceData[p]; 
            }
            newMake.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.uri = resolveUrl('entities/car_rental.Make/instances/' + created._id);
                    delete created._id;
                    delete created.__v;
                    console.log(created);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Customer
        app.get("/entities/car_rental.Customer", function(req, res) {
            res.json({
               fullName : "car_rental.Customer",
               extentUri : resolveUrl("entities/car_rental.Customer/instances"),
               templateUri : resolveUrl("entities/car_rental.Customer/template"),
               uri : resolveUrl("entities/car_rental.Customer")
            });
        });
        app.get("/entities/car_rental.Customer/instances", function(req, res) {
            return mongoose.model('Customer').find().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json({
                        uri: resolveUrl('entities/car_rental.Customer/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Customer/template", function(req, res) {
            res.json(new Customer());
        });
        app.post("/entities/car_rental.Customer/instances", function(req, res) {
            var instanceData = req.body;
            var newCustomer = new Customer();
            for (var p in instanceData) {
                newCustomer[p] = instanceData[p]; 
            }
            newCustomer.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.uri = resolveUrl('entities/car_rental.Customer/instances/' + created._id);
                    delete created._id;
                    delete created.__v;
                    console.log(created);
                    res.status(201).json(created);    
                }
            });
        });
    }
};
