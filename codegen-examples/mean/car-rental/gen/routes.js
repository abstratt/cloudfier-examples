var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var Car = require('./models/Car.js');
var Rental = require('./models/Rental.js');
var Model = require('./models/Model.js');
var Make = require('./models/Make.js');
var Customer = require('./models/Customer.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
                    
        // helps with removing internal metadata            
        var renderInstance = function (entityName, instance) {
            instance.objectId = instance._id;
            delete instance._id;
            delete instance.__v;
            instance.uri = resolveUrl('entities/'+ entityName + '/instances/' + instance.objectId);
            instance.entityUri = resolveUrl('entities/'+ entityName);
            return instance;
        };
        
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
                    res.json(renderInstance('car_rental.Car', found));
                }
            });
        });
        app.get("/entities/car_rental.Car/instances", function(req, res) {
            return mongoose.model('Car').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('car_rental.Car', each));
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
            var template = new Car().toObject();
            res.json(renderInstance('car_rental.Car', template));
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
        app.put("/entities/car_rental.Car/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Car').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('car_rental.Car', found));
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
                    res.json(renderInstance('car_rental.Rental', found));
                }
            });
        });
        app.get("/entities/car_rental.Rental/instances", function(req, res) {
            return mongoose.model('Rental').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('car_rental.Rental', each));
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
            var template = new Rental().toObject();
            template.started = (function() {
                return new Date();
            })();
            res.json(renderInstance('car_rental.Rental', template));
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
        app.put("/entities/car_rental.Rental/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Rental').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('car_rental.Rental', found));
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
                    res.json(renderInstance('car_rental.Model', found));
                }
            });
        });
        app.get("/entities/car_rental.Model/instances", function(req, res) {
            return mongoose.model('Model').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('car_rental.Model', each));
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
            var template = new Model().toObject();
            res.json(renderInstance('car_rental.Model', template));
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
        app.put("/entities/car_rental.Model/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Model').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('car_rental.Model', found));
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
                    res.json(renderInstance('car_rental.Make', found));
                }
            });
        });
        app.get("/entities/car_rental.Make/instances", function(req, res) {
            return mongoose.model('Make').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('car_rental.Make', each));
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
            var template = new Make().toObject();
            res.json(renderInstance('car_rental.Make', template));
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
        app.put("/entities/car_rental.Make/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Make').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('car_rental.Make', found));
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
                    res.json(renderInstance('car_rental.Customer', found));
                }
            });
        });
        app.get("/entities/car_rental.Customer/instances", function(req, res) {
            return mongoose.model('Customer').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('car_rental.Customer', each));
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
            var template = new Customer().toObject();
            res.json(renderInstance('car_rental.Customer', template));
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
        app.put("/entities/car_rental.Customer/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Customer').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('car_rental.Customer', found));
                }
            });
        });
        
    }
};
