var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var Car = require('./models/Car.js');
var Rental = require('./models/Rental.js');
var Model = require('./models/Model.js');
var Make = require('./models/Make.js');
var Customer = require('./models/Customer.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            cls.getNamespace('session').run(function(context) {
                res.json({
                    applicationName : "Car rental",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "car_rental.Car",
                    label : "Car",
                    description : "",
                    uri : resolveUrl("entities/car_rental.Car"),
                    extentUri : resolveUrl("entities/car_rental.Car/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/car_rental.Car/template")
                },
                 {
                    fullName : "car_rental.Rental",
                    label : "Rental",
                    description : "",
                    uri : resolveUrl("entities/car_rental.Rental"),
                    extentUri : resolveUrl("entities/car_rental.Rental/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/car_rental.Rental/template")
                },
                 {
                    fullName : "car_rental.Model",
                    label : "Model",
                    description : "",
                    uri : resolveUrl("entities/car_rental.Model"),
                    extentUri : resolveUrl("entities/car_rental.Model/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/car_rental.Model/template")
                },
                 {
                    fullName : "car_rental.Make",
                    label : "Make",
                    description : "",
                    uri : resolveUrl("entities/car_rental.Make"),
                    extentUri : resolveUrl("entities/car_rental.Make/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/car_rental.Make/template")
                },
                 {
                    fullName : "car_rental.Customer",
                    label : "Customer",
                    description : "",
                    uri : resolveUrl("entities/car_rental.Customer"),
                    extentUri : resolveUrl("entities/car_rental.Customer/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/car_rental.Customer/template")
                }
            ]);
        });
        // routes for car_rental.Car
        app.get("/entities/car_rental.Car", function(req, res) {
            res.json({
                fullName : "car_rental.Car",
                label : "Car",
                description : "",
                uri : resolveUrl("entities/car_rental.Car"),
                extentUri : resolveUrl("entities/car_rental.Car/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/car_rental.Car/template")
            });
        });
        app.get("/entities/car_rental.Car/instances/:objectId", function(req, res) {
            return mongoose.model('Car').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/car_rental.Car/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/car_rental.Car/instances", function(req, res) {
            return mongoose.model('Car').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/car_rental.Car/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/car_rental.Car/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Car/template", function(req, res) {
            var template = new Car();
            res.json(template);
        });
        app.post("/entities/car_rental.Car/instances", function(req, res) {
            var instanceData = req.body;
            var newCar = new Car();
            newCar.plate = instanceData.plate;
            newCar.price = instanceData.price;
            newCar.year = instanceData.year;
            newCar.color = instanceData.color;
            newCar.status = instanceData.status;
            newCar.model = instanceData.model && instanceData.model.objectId;
            newCar.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/car_rental.Car/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Rental
        app.get("/entities/car_rental.Rental", function(req, res) {
            res.json({
                fullName : "car_rental.Rental",
                label : "Rental",
                description : "",
                uri : resolveUrl("entities/car_rental.Rental"),
                extentUri : resolveUrl("entities/car_rental.Rental/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/car_rental.Rental/template")
            });
        });
        app.get("/entities/car_rental.Rental/instances/:objectId", function(req, res) {
            return mongoose.model('Rental').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/car_rental.Rental/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/car_rental.Rental/instances", function(req, res) {
            return mongoose.model('Rental').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/car_rental.Rental/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/car_rental.Rental/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Rental/template", function(req, res) {
            var template = new Rental();
            template.started = (function() {
                return new Date();
            })();
            res.json(template);
        });
        app.post("/entities/car_rental.Rental/instances", function(req, res) {
            var instanceData = req.body;
            var newRental = new Rental();
            newRental.started = instanceData.started;
            newRental.returned = instanceData.returned;
            newRental.car = instanceData.car && instanceData.car.objectId;
            newRental.customer = instanceData.customer && instanceData.customer.objectId;
            newRental.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/car_rental.Rental/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Model
        app.get("/entities/car_rental.Model", function(req, res) {
            res.json({
                fullName : "car_rental.Model",
                label : "Model",
                description : "",
                uri : resolveUrl("entities/car_rental.Model"),
                extentUri : resolveUrl("entities/car_rental.Model/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/car_rental.Model/template")
            });
        });
        app.get("/entities/car_rental.Model/instances/:objectId", function(req, res) {
            return mongoose.model('Model').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/car_rental.Model/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/car_rental.Model/instances", function(req, res) {
            return mongoose.model('Model').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/car_rental.Model/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/car_rental.Model/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Model/template", function(req, res) {
            var template = new Model();
            res.json(template);
        });
        app.post("/entities/car_rental.Model/instances", function(req, res) {
            var instanceData = req.body;
            var newModel = new Model();
            newModel.name = instanceData.name;
            newModel.make = instanceData.make && instanceData.make.objectId;
            newModel.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/car_rental.Model/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Make
        app.get("/entities/car_rental.Make", function(req, res) {
            res.json({
                fullName : "car_rental.Make",
                label : "Make",
                description : "",
                uri : resolveUrl("entities/car_rental.Make"),
                extentUri : resolveUrl("entities/car_rental.Make/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/car_rental.Make/template")
            });
        });
        app.get("/entities/car_rental.Make/instances/:objectId", function(req, res) {
            return mongoose.model('Make').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/car_rental.Make/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/car_rental.Make/instances", function(req, res) {
            return mongoose.model('Make').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/car_rental.Make/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/car_rental.Make/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Make/template", function(req, res) {
            var template = new Make();
            res.json(template);
        });
        app.post("/entities/car_rental.Make/instances", function(req, res) {
            var instanceData = req.body;
            var newMake = new Make();
            newMake.name = instanceData.name;
            newMake.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/car_rental.Make/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for car_rental.Customer
        app.get("/entities/car_rental.Customer", function(req, res) {
            res.json({
                fullName : "car_rental.Customer",
                label : "Customer",
                description : "",
                uri : resolveUrl("entities/car_rental.Customer"),
                extentUri : resolveUrl("entities/car_rental.Customer/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/car_rental.Customer/template")
            });
        });
        app.get("/entities/car_rental.Customer/instances/:objectId", function(req, res) {
            return mongoose.model('Customer').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/car_rental.Customer/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/car_rental.Customer/instances", function(req, res) {
            return mongoose.model('Customer').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/car_rental.Customer/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/car_rental.Customer/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/car_rental.Customer/template", function(req, res) {
            var template = new Customer();
            res.json(template);
        });
        app.post("/entities/car_rental.Customer/instances", function(req, res) {
            var instanceData = req.body;
            var newCustomer = new Customer();
            newCustomer.name = instanceData.name;
            newCustomer.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/car_rental.Customer/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
    }
};
