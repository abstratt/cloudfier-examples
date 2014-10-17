var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var Person = require('./models/Person.js');
var AutoMechanic = require('./models/AutoMechanic.js');
var Customer = require('./models/Customer.js');
var Car = require('./models/Car.js');
var Service = require('./models/Service.js');
var Make = require('./models/Make.js');
var Model = require('./models/Model.js');

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
                    applicationName : "Carserv",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "carserv.Person",
                    label : "Person",
                    description : "",
                    uri : resolveUrl("entities/carserv.Person"),
                    extentUri : resolveUrl("entities/carserv.Person/instances"),
                    user : false,
                    concrete : false,
                    standalone : true,
                    templateUri : resolveUrl("entities/carserv.Person/template")
                },
                 {
                    fullName : "carserv.AutoMechanic",
                    label : "AutoMechanic",
                    description : "",
                    uri : resolveUrl("entities/carserv.AutoMechanic"),
                    extentUri : resolveUrl("entities/carserv.AutoMechanic/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/carserv.AutoMechanic/template")
                },
                 {
                    fullName : "carserv.Customer",
                    label : "Customer",
                    description : "",
                    uri : resolveUrl("entities/carserv.Customer"),
                    extentUri : resolveUrl("entities/carserv.Customer/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/carserv.Customer/template")
                },
                 {
                    fullName : "carserv.Car",
                    label : "Car",
                    description : "",
                    uri : resolveUrl("entities/carserv.Car"),
                    extentUri : resolveUrl("entities/carserv.Car/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/carserv.Car/template")
                },
                 {
                    fullName : "carserv.Service",
                    label : "Service",
                    description : "",
                    uri : resolveUrl("entities/carserv.Service"),
                    extentUri : resolveUrl("entities/carserv.Service/instances"),
                    user : false,
                    concrete : true,
                    standalone : true
                },
                 {
                    fullName : "carserv.Make",
                    label : "Make",
                    description : "",
                    uri : resolveUrl("entities/carserv.Make"),
                    extentUri : resolveUrl("entities/carserv.Make/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/carserv.Make/template")
                },
                 {
                    fullName : "carserv.Model",
                    label : "Model",
                    description : "",
                    uri : resolveUrl("entities/carserv.Model"),
                    extentUri : resolveUrl("entities/carserv.Model/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/carserv.Model/template")
                }
            ]);
        });
        // routes for carserv.Person
        app.get("/entities/carserv.Person", function(req, res) {
            res.json({
                fullName : "carserv.Person",
                label : "Person",
                description : "",
                uri : resolveUrl("entities/carserv.Person"),
                extentUri : resolveUrl("entities/carserv.Person/instances"),
                user : false,
                concrete : false,
                standalone : true,
                templateUri : resolveUrl("entities/carserv.Person/template")
            });
        });
        app.get("/entities/carserv.Person/instances/:objectId", function(req, res) {
            return mongoose.model('Person').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Person', found));
                }
            });
        });
        app.get("/entities/carserv.Person/instances", function(req, res) {
            return mongoose.model('Person').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('carserv.Person', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/carserv.Person/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/carserv.Person/template", function(req, res) {
            var template = new Person().toObject();
            res.json(renderInstance('carserv.Person', template));
        });
        app.post("/entities/carserv.Person/instances", function(req, res) {
            var instanceData = req.body;
            var newPerson = new Person();
            newPerson.firstName = instanceData.firstName;
            newPerson.lastName = instanceData.lastName;
            newPerson.username = instanceData.username;
            newPerson.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/carserv.Person/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/carserv.Person/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Person').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Person', found));
                }
            });
        });
        
        
        
        // routes for carserv.AutoMechanic
        app.get("/entities/carserv.AutoMechanic", function(req, res) {
            res.json({
                fullName : "carserv.AutoMechanic",
                label : "AutoMechanic",
                description : "",
                uri : resolveUrl("entities/carserv.AutoMechanic"),
                extentUri : resolveUrl("entities/carserv.AutoMechanic/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/carserv.AutoMechanic/template")
            });
        });
        app.get("/entities/carserv.AutoMechanic/instances/:objectId", function(req, res) {
            return mongoose.model('AutoMechanic').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.AutoMechanic', found));
                }
            });
        });
        app.get("/entities/carserv.AutoMechanic/instances", function(req, res) {
            return mongoose.model('AutoMechanic').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('carserv.AutoMechanic', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/carserv.AutoMechanic/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/carserv.AutoMechanic/template", function(req, res) {
            var template = new AutoMechanic().toObject();
            res.json(renderInstance('carserv.AutoMechanic', template));
        });
        app.post("/entities/carserv.AutoMechanic/instances", function(req, res) {
            var instanceData = req.body;
            var newAutoMechanic = new AutoMechanic();
            newAutoMechanic.firstName = instanceData.firstName;
            newAutoMechanic.lastName = instanceData.lastName;
            newAutoMechanic.username = instanceData.username;
            newAutoMechanic.status = instanceData.status;
            newAutoMechanic.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/carserv.AutoMechanic/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/carserv.AutoMechanic/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('AutoMechanic').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.AutoMechanic', found));
                }
            });
        });
        
        
        
        // routes for carserv.Customer
        app.get("/entities/carserv.Customer", function(req, res) {
            res.json({
                fullName : "carserv.Customer",
                label : "Customer",
                description : "",
                uri : resolveUrl("entities/carserv.Customer"),
                extentUri : resolveUrl("entities/carserv.Customer/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/carserv.Customer/template")
            });
        });
        app.get("/entities/carserv.Customer/instances/:objectId", function(req, res) {
            return mongoose.model('Customer').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Customer', found));
                }
            });
        });
        app.get("/entities/carserv.Customer/instances", function(req, res) {
            return mongoose.model('Customer').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('carserv.Customer', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/carserv.Customer/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/carserv.Customer/template", function(req, res) {
            var template = new Customer().toObject();
            res.json(renderInstance('carserv.Customer', template));
        });
        app.post("/entities/carserv.Customer/instances", function(req, res) {
            var instanceData = req.body;
            var newCustomer = new Customer();
            newCustomer.firstName = instanceData.firstName;
            newCustomer.lastName = instanceData.lastName;
            newCustomer.username = instanceData.username;
            newCustomer.title = instanceData.title;
            newCustomer.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/carserv.Customer/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/carserv.Customer/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Customer').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Customer', found));
                }
            });
        });
        
        
        
        // routes for carserv.Car
        app.get("/entities/carserv.Car", function(req, res) {
            res.json({
                fullName : "carserv.Car",
                label : "Car",
                description : "",
                uri : resolveUrl("entities/carserv.Car"),
                extentUri : resolveUrl("entities/carserv.Car/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/carserv.Car/template")
            });
        });
        app.get("/entities/carserv.Car/instances/:objectId", function(req, res) {
            return mongoose.model('Car').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Car', found));
                }
            });
        });
        app.get("/entities/carserv.Car/instances", function(req, res) {
            return mongoose.model('Car').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('carserv.Car', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/carserv.Car/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/carserv.Car/template", function(req, res) {
            var template = new Car().toObject();
            res.json(renderInstance('carserv.Car', template));
        });
        app.post("/entities/carserv.Car/instances", function(req, res) {
            var instanceData = req.body;
            var newCar = new Car();
            newCar.registrationNumber = instanceData.registrationNumber;
            newCar.model = instanceData.model && instanceData.model.objectId;
            newCar.owner = instanceData.owner && instanceData.owner.objectId;
            newCar.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/carserv.Car/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/carserv.Car/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Car').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Car', found));
                }
            });
        });
        
        
        
        // routes for carserv.Service
        app.get("/entities/carserv.Service", function(req, res) {
            res.json({
                fullName : "carserv.Service",
                label : "Service",
                description : "",
                uri : resolveUrl("entities/carserv.Service"),
                extentUri : resolveUrl("entities/carserv.Service/instances"),
                user : false,
                concrete : true,
                standalone : true
            });
        });
        app.get("/entities/carserv.Service/instances/:objectId", function(req, res) {
            return mongoose.model('Service').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Service', found));
                }
            });
        });
        app.get("/entities/carserv.Service/instances", function(req, res) {
            return mongoose.model('Service').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('carserv.Service', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/carserv.Service/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.put("/entities/carserv.Service/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Service').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Service', found));
                }
            });
        });
        
        
        
        // routes for carserv.Make
        app.get("/entities/carserv.Make", function(req, res) {
            res.json({
                fullName : "carserv.Make",
                label : "Make",
                description : "",
                uri : resolveUrl("entities/carserv.Make"),
                extentUri : resolveUrl("entities/carserv.Make/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/carserv.Make/template")
            });
        });
        app.get("/entities/carserv.Make/instances/:objectId", function(req, res) {
            return mongoose.model('Make').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Make', found));
                }
            });
        });
        app.get("/entities/carserv.Make/instances", function(req, res) {
            return mongoose.model('Make').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('carserv.Make', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/carserv.Make/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/carserv.Make/template", function(req, res) {
            var template = new Make().toObject();
            res.json(renderInstance('carserv.Make', template));
        });
        app.post("/entities/carserv.Make/instances", function(req, res) {
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
                    created.uri = resolveUrl('entities/carserv.Make/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/carserv.Make/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Make').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Make', found));
                }
            });
        });
        
        
        
        // routes for carserv.Model
        app.get("/entities/carserv.Model", function(req, res) {
            res.json({
                fullName : "carserv.Model",
                label : "Model",
                description : "",
                uri : resolveUrl("entities/carserv.Model"),
                extentUri : resolveUrl("entities/carserv.Model/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/carserv.Model/template")
            });
        });
        app.get("/entities/carserv.Model/instances/:objectId", function(req, res) {
            return mongoose.model('Model').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Model', found));
                }
            });
        });
        app.get("/entities/carserv.Model/instances", function(req, res) {
            return mongoose.model('Model').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('carserv.Model', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/carserv.Model/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/carserv.Model/template", function(req, res) {
            var template = new Model().toObject();
            res.json(renderInstance('carserv.Model', template));
        });
        app.post("/entities/carserv.Model/instances", function(req, res) {
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
                    created.uri = resolveUrl('entities/carserv.Model/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/carserv.Model/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Model').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('carserv.Model', found));
                }
            });
        });
        
    }
};
